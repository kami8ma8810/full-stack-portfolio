/**
 * Notion APIサービス
 * 
 * Notion APIと連携してブログ記事を取得するサービスです。
 * Notion SDKを使用して、データベースから記事情報を取得し、
 * フロントエンドで使いやすい形式に変換します。
 */

import { Client } from '@notionhq/client';
import type { Bindings } from '../types/bindings';
import type { BlogPost } from '@portfolio/types';

/**
 * Notionのページプロパティ型（簡略化）
 */
interface NotionPageProperties {
  Title: { title: Array<{ plain_text: string }> };
  Slug: { rich_text: Array<{ plain_text: string }> };
  Status: { select: { name: string } };
  Published: { date: { start: string } };
  Tags: { multi_select: Array<{ name: string }> };
  Description: { rich_text: Array<{ plain_text: string }> };
}

export class NotionService {
  private client: Client;
  private databaseId: string;

  constructor(private env: Bindings) {
    this.client = new Client({
      auth: env.NOTION_API_KEY,
    });
    this.databaseId = env.NOTION_BLOG_DATABASE_ID;
  }

  /**
   * ブログ記事一覧を取得
   */
  async getBlogPosts(options: {
    page: number;
    limit: number;
    status: 'all' | 'published' | 'draft';
    tag?: string;
  }): Promise<{ posts: BlogPost[]; total: number }> {
    try {
      // フィルター条件を構築
      const filter: any = {
        and: [],
      };

      // ステータスフィルター
      if (options.status !== 'all') {
        filter.and.push({
          property: 'Status',
          select: {
            equals: options.status,
          },
        });
      }

      // タグフィルター
      if (options.tag) {
        filter.and.push({
          property: 'Tags',
          multi_select: {
            contains: options.tag,
          },
        });
      }

      // Notion APIでクエリ実行
      const response = await this.client.databases.query({
        database_id: this.databaseId,
        filter: filter.and.length > 0 ? filter : undefined,
        sorts: [
          {
            property: 'Published',
            direction: 'descending',
          },
        ],
        page_size: options.limit,
        start_cursor: options.page > 1 ? this.calculateCursor(options.page, options.limit) : undefined,
      });

      // ページデータをBlogPost型に変換
      const posts = response.results.map((page: any) => 
        this.notionPageToBlogPost(page)
      );

      // 総数を取得（簡易実装、実際はページネーション対応が必要）
      const total = response.has_more ? 100 : response.results.length;

      return { posts, total };
    } catch (error) {
      console.error('Failed to fetch from Notion:', error);
      throw new Error('Failed to fetch blog posts from Notion');
    }
  }

  /**
   * 特定のブログ記事を取得
   */
  async getBlogPost(slug: string): Promise<BlogPost | null> {
    try {
      // スラッグで記事を検索
      const response = await this.client.databases.query({
        database_id: this.databaseId,
        filter: {
          property: 'Slug',
          rich_text: {
            equals: slug,
          },
        },
        page_size: 1,
      });

      if (response.results.length === 0) {
        return null;
      }

      const page = response.results[0];
      const post = this.notionPageToBlogPost(page);

      // ページコンテンツを取得
      const content = await this.getPageContent(page.id);
      post.content = content;

      return post;
    } catch (error) {
      console.error('Failed to fetch post from Notion:', error);
      throw new Error('Failed to fetch blog post from Notion');
    }
  }

  /**
   * すべてのタグを取得
   */
  async getAllTags(): Promise<string[]> {
    try {
      // すべての記事からタグを収集（簡易実装）
      const response = await this.client.databases.query({
        database_id: this.databaseId,
        filter: {
          property: 'Status',
          select: {
            equals: 'published',
          },
        },
        page_size: 100,
      });

      const tagsSet = new Set<string>();
      response.results.forEach((page: any) => {
        const properties = page.properties as NotionPageProperties;
        properties.Tags.multi_select.forEach((tag) => {
          tagsSet.add(tag.name);
        });
      });

      return Array.from(tagsSet).sort();
    } catch (error) {
      console.error('Failed to fetch tags from Notion:', error);
      throw new Error('Failed to fetch tags from Notion');
    }
  }

  /**
   * NotionページをBlogPost型に変換
   */
  private notionPageToBlogPost(page: any): BlogPost {
    const properties = page.properties as NotionPageProperties;
    
    return {
      id: page.id,
      slug: properties.Slug.rich_text[0]?.plain_text || '',
      title: properties.Title.title[0]?.plain_text || '',
      description: properties.Description.rich_text[0]?.plain_text || '',
      publishedAt: properties.Published.date.start,
      updatedAt: page.last_edited_time,
      status: properties.Status.select.name as 'draft' | 'published',
      tags: properties.Tags.multi_select.map((tag) => tag.name),
    };
  }

  /**
   * ページコンテンツを取得してMarkdownに変換
   */
  private async getPageContent(pageId: string): Promise<string> {
    try {
      const blocks = await this.client.blocks.children.list({
        block_id: pageId,
        page_size: 100,
      });

      // ブロックをMarkdownに変換（簡易実装）
      return this.blocksToMarkdown(blocks.results);
    } catch (error) {
      console.error('Failed to fetch page content:', error);
      return '';
    }
  }

  /**
   * NotionブロックをMarkdownに変換（簡易実装）
   */
  private blocksToMarkdown(blocks: any[]): string {
    return blocks
      .map((block) => {
        switch (block.type) {
          case 'paragraph':
            return block.paragraph.rich_text
              .map((text: any) => text.plain_text)
              .join('');
          case 'heading_1':
            return `# ${block.heading_1.rich_text
              .map((text: any) => text.plain_text)
              .join('')}`;
          case 'heading_2':
            return `## ${block.heading_2.rich_text
              .map((text: any) => text.plain_text)
              .join('')}`;
          case 'heading_3':
            return `### ${block.heading_3.rich_text
              .map((text: any) => text.plain_text)
              .join('')}`;
          case 'bulleted_list_item':
            return `- ${block.bulleted_list_item.rich_text
              .map((text: any) => text.plain_text)
              .join('')}`;
          case 'numbered_list_item':
            return `1. ${block.numbered_list_item.rich_text
              .map((text: any) => text.plain_text)
              .join('')}`;
          case 'code':
            const language = block.code.language || '';
            const code = block.code.rich_text
              .map((text: any) => text.plain_text)
              .join('');
            return `\`\`\`${language}\n${code}\n\`\`\``;
          default:
            return '';
        }
      })
      .filter(Boolean)
      .join('\n\n');
  }

  /**
   * ページネーションのカーソル計算（簡易実装）
   */
  private calculateCursor(page: number, limit: number): string | undefined {
    // 実際のカーソル実装は複雑なため、簡易的に実装
    return undefined;
  }
}