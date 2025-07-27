/**
 * ブログサービス
 * 
 * ブログ記事のビュー数管理やキャッシュ処理を行うサービスです。
 * Cloudflare D1とKVを使用してデータの永続化とキャッシュを実現します。
 */

import type { Bindings } from '../types/bindings';
import type { BlogPost } from '@portfolio/types';
import { cacheConfig } from '../config';

export class BlogService {
  constructor(private env: Bindings) {}

  /**
   * ビュー数を取得
   */
  async getViewCount(slug: string): Promise<number> {
    try {
      const result = await this.env.DB.prepare(
        'SELECT view_count FROM blog_views WHERE slug = ?'
      )
        .bind(slug)
        .first<{ view_count: number }>();

      return result?.view_count || 0;
    } catch (error) {
      console.error('Failed to get view count:', error);
      return 0;
    }
  }

  /**
   * ビュー数を増やす
   * 同一IPからの連続カウントを防ぐため、一定時間の制限を設ける
   */
  async incrementViewCount(slug: string, ip: string): Promise<number> {
    try {
      // IPベースのレート制限チェック
      const viewKey = `blog_view:${slug}:${ip}`;
      const hasViewed = await this.env.CACHE.get(viewKey);
      
      if (hasViewed) {
        // すでにカウント済みの場合は現在の値を返す
        return this.getViewCount(slug);
      }

      // ビュー数を増やす
      await this.env.DB.prepare(`
        INSERT INTO blog_views (slug, view_count, last_viewed_at)
        VALUES (?, 1, CURRENT_TIMESTAMP)
        ON CONFLICT(slug) DO UPDATE SET
          view_count = view_count + 1,
          last_viewed_at = CURRENT_TIMESTAMP
      `).bind(slug).run();

      // IPごとのビュー記録を保存（1時間有効）
      await this.env.CACHE.put(viewKey, '1', {
        expirationTtl: 3600,
      });

      // 更新後のビュー数を取得
      return this.getViewCount(slug);
    } catch (error) {
      console.error('Failed to increment view count:', error);
      const currentCount = await this.getViewCount(slug);
      return currentCount;
    }
  }

  /**
   * キャッシュから記事を取得
   */
  async getCachedPost(slug: string): Promise<BlogPost | null> {
    try {
      const cacheKey = `blog_post:${slug}`;
      const cached = await this.env.CACHE.get(cacheKey);
      
      if (!cached) {
        return null;
      }

      return JSON.parse(cached) as BlogPost;
    } catch (error) {
      console.error('Failed to get cached post:', error);
      return null;
    }
  }

  /**
   * 記事をキャッシュに保存
   */
  async cachePost(slug: string, post: BlogPost): Promise<void> {
    try {
      const cacheKey = `blog_post:${slug}`;
      await this.env.CACHE.put(
        cacheKey,
        JSON.stringify(post),
        {
          expirationTtl: cacheConfig.blogPostTTL,
        }
      );
    } catch (error) {
      console.error('Failed to cache post:', error);
      // キャッシュの失敗は無視（サービスの継続性を優先）
    }
  }

  /**
   * ブログ記事の統計情報を取得
   */
  async getBlogStats(): Promise<{
    totalPosts: number;
    totalViews: number;
    popularPosts: Array<{ slug: string; viewCount: number }>;
  }> {
    try {
      // 総ビュー数
      const totalViewsResult = await this.env.DB.prepare(
        'SELECT SUM(view_count) as total FROM blog_views'
      ).first<{ total: number }>();

      // 人気記事トップ5
      const popularPosts = await this.env.DB.prepare(`
        SELECT slug, view_count
        FROM blog_views
        ORDER BY view_count DESC
        LIMIT 5
      `).all<{ slug: string; view_count: number }>();

      return {
        totalPosts: 0, // Notion APIから取得する必要がある
        totalViews: totalViewsResult?.total || 0,
        popularPosts: popularPosts.results || [],
      };
    } catch (error) {
      console.error('Failed to get blog stats:', error);
      return {
        totalPosts: 0,
        totalViews: 0,
        popularPosts: [],
      };
    }
  }

  /**
   * キャッシュをクリア
   */
  async clearCache(slug?: string): Promise<void> {
    try {
      if (slug) {
        // 特定の記事のキャッシュをクリア
        const cacheKey = `blog_post:${slug}`;
        await this.env.CACHE.delete(cacheKey);
      } else {
        // すべての記事キャッシュをクリア（実装は省略）
        console.log('Clear all blog cache');
      }
    } catch (error) {
      console.error('Failed to clear cache:', error);
    }
  }
}