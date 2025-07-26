/**
 * ブログ関連のAPIルート
 * 
 * Notion APIと連携してブログ記事の取得・管理を行います。
 * ビュー数の管理はCloudflare D1で行います。
 */

import { Hono } from 'hono';
import { z } from 'zod';
import { zValidator } from '@hono/zod-validator';
import type { Bindings } from '../types/bindings';
import { NotionService } from '../services/notion';
import { BlogService } from '../services/blog';
import type { BlogPost } from '@portfolio/types';

const blogRoutes = new Hono<{ Bindings: Bindings }>();

/**
 * クエリパラメータのバリデーションスキーマ
 */
const listQuerySchema = z.object({
  page: z.string().regex(/^\d+$/).transform(Number).default('1'),
  limit: z.string().regex(/^\d+$/).transform(Number).default('10'),
  status: z.enum(['all', 'published', 'draft']).default('published'),
  tag: z.string().optional(),
});

/**
 * GET /api/blog
 * ブログ記事一覧を取得
 */
blogRoutes.get('/', zValidator('query', listQuerySchema), async (c) => {
  const query = c.req.valid('query');
  const notionService = new NotionService(c.env);
  const blogService = new BlogService(c.env);

  try {
    // Notionから記事一覧を取得
    const { posts, total } = await notionService.getBlogPosts({
      page: query.page,
      limit: query.limit,
      status: query.status,
      tag: query.tag,
    });

    // 各記事のビュー数を取得
    const postsWithViews = await Promise.all(
      posts.map(async (post) => {
        const viewCount = await blogService.getViewCount(post.slug);
        return { ...post, viewCount };
      }),
    );

    // ページネーション情報をヘッダーに追加
    c.header('X-Total-Count', String(total));
    c.header('X-Total-Pages', String(Math.ceil(total / query.limit)));

    return c.json({
      posts: postsWithViews,
      pagination: {
        page: query.page,
        limit: query.limit,
        total,
        totalPages: Math.ceil(total / query.limit),
      },
    });
  } catch (error) {
    console.error('Failed to fetch blog posts:', error);
    throw error;
  }
});

/**
 * GET /api/blog/:slug
 * 特定のブログ記事を取得
 */
blogRoutes.get('/:slug', async (c) => {
  const slug = c.req.param('slug');
  const notionService = new NotionService(c.env);
  const blogService = new BlogService(c.env);

  try {
    // キャッシュをチェック
    const cached = await blogService.getCachedPost(slug);
    if (cached) {
      // キャッシュヒット時はヘッダーで通知
      c.header('X-Cache', 'HIT');
      return c.json(cached);
    }

    // Notionから記事を取得
    const post = await notionService.getBlogPost(slug);
    if (!post) {
      return c.json({ error: 'Post not found' }, 404);
    }

    // ビュー数を取得
    const viewCount = await blogService.getViewCount(slug);
    const postWithViews = { ...post, viewCount };

    // キャッシュに保存
    await blogService.cachePost(slug, postWithViews);

    c.header('X-Cache', 'MISS');
    return c.json(postWithViews);
  } catch (error) {
    console.error('Failed to fetch blog post:', error);
    throw error;
  }
});

/**
 * POST /api/blog/:slug/view
 * ブログ記事のビュー数を増やす
 */
blogRoutes.post('/:slug/view', async (c) => {
  const slug = c.req.param('slug');
  const blogService = new BlogService(c.env);

  try {
    // IPアドレスを取得（同一IPからの連続カウントを防ぐ）
    const ip = c.req.header('CF-Connecting-IP') || 'unknown';
    
    // ビュー数を増やす
    const newCount = await blogService.incrementViewCount(slug, ip);

    return c.json({ viewCount: newCount });
  } catch (error) {
    console.error('Failed to increment view count:', error);
    throw error;
  }
});

/**
 * GET /api/blog/tags
 * 使用されているタグ一覧を取得
 */
blogRoutes.get('/tags', async (c) => {
  const notionService = new NotionService(c.env);

  try {
    const tags = await notionService.getAllTags();
    return c.json({ tags });
  } catch (error) {
    console.error('Failed to fetch tags:', error);
    throw error;
  }
});

export { blogRoutes };