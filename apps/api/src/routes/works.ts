/**
 * Works（作品・プロジェクト）関連のAPIルート
 * 
 * ポートフォリオに掲載する作品情報の管理を行います。
 * 作品データは設定ファイルまたはCMSから取得し、
 * いいね数やビュー数はD1で管理します。
 */

import { Hono } from 'hono';
import { z } from 'zod';
import { zValidator } from '@hono/zod-validator';
import type { Bindings } from '../types/bindings';
import { WorksService } from '../services/works';
import type { Work } from '@portfolio/types';

const worksRoutes = new Hono<{ Bindings: Bindings }>();

/**
 * 作品データ（仮データ）
 * 実際の運用では、CMSやJSONファイルから読み込む
 */
const MOCK_WORKS: Omit<Work, 'likes' | 'views'>[] = [
  {
    id: 'portfolio-site',
    title: 'ポートフォリオサイト',
    description: 'Next.js、Hono、Cloudflare Workersを使用したフルスタックポートフォリオサイト',
    techStack: ['Next.js', 'TypeScript', 'Hono', 'Cloudflare Workers', 'Tailwind CSS'],
    demoUrl: 'https://portfolio.example.com',
    githubUrl: 'https://github.com/username/portfolio',
    thumbnailUrl: '/images/works/portfolio.png',
    createdAt: '2024-01-01',
  },
  // 他の作品データ...
];

/**
 * GET /api/works
 * 作品一覧を取得
 */
worksRoutes.get('/', async (c) => {
  const worksService = new WorksService(c.env);

  try {
    // 作品データに統計情報を追加
    const worksWithStats = await Promise.all(
      MOCK_WORKS.map(async (work) => {
        const stats = await worksService.getProjectStats(work.id);
        return {
          ...work,
          likes: stats.likes,
          views: stats.views,
        };
      }),
    );

    // ビュー数の多い順にソート
    worksWithStats.sort((a, b) => b.views - a.views);

    return c.json({ works: worksWithStats });
  } catch (error) {
    console.error('Failed to fetch works:', error);
    throw error;
  }
});

/**
 * GET /api/works/:id
 * 特定の作品詳細を取得
 */
worksRoutes.get('/:id', async (c) => {
  const id = c.req.param('id');
  const worksService = new WorksService(c.env);

  try {
    // 作品データを検索
    const work = MOCK_WORKS.find((w) => w.id === id);
    if (!work) {
      return c.json({ error: 'Work not found' }, 404);
    }

    // 統計情報を取得
    const stats = await worksService.getProjectStats(id);

    // ビュー数を増やす
    await worksService.incrementViews(id);

    return c.json({
      ...work,
      likes: stats.likes,
      views: stats.views + 1, // 今回のビューを反映
    });
  } catch (error) {
    console.error('Failed to fetch work:', error);
    throw error;
  }
});

/**
 * POST /api/works/:id/like
 * 作品にいいねをつける
 */
worksRoutes.post('/:id/like', async (c) => {
  const id = c.req.param('id');
  const worksService = new WorksService(c.env);

  try {
    // 作品の存在確認
    const work = MOCK_WORKS.find((w) => w.id === id);
    if (!work) {
      return c.json({ error: 'Work not found' }, 404);
    }

    // IPアドレスベースで重複いいねを防ぐ
    const ip = c.req.header('CF-Connecting-IP') || 'unknown';
    const hasLiked = await worksService.hasUserLiked(id, ip);
    
    if (hasLiked) {
      return c.json({ error: 'Already liked' }, 400);
    }

    // いいね数を増やす
    const newLikes = await worksService.incrementLikes(id, ip);

    return c.json({ likes: newLikes });
  } catch (error) {
    console.error('Failed to like work:', error);
    throw error;
  }
});

/**
 * DELETE /api/works/:id/like
 * いいねを取り消す
 */
worksRoutes.delete('/:id/like', async (c) => {
  const id = c.req.param('id');
  const worksService = new WorksService(c.env);

  try {
    // 作品の存在確認
    const work = MOCK_WORKS.find((w) => w.id === id);
    if (!work) {
      return c.json({ error: 'Work not found' }, 404);
    }

    // IPアドレスベースでいいねを取り消す
    const ip = c.req.header('CF-Connecting-IP') || 'unknown';
    const hasLiked = await worksService.hasUserLiked(id, ip);
    
    if (!hasLiked) {
      return c.json({ error: 'Not liked yet' }, 400);
    }

    // いいね数を減らす
    const newLikes = await worksService.decrementLikes(id, ip);

    return c.json({ likes: newLikes });
  } catch (error) {
    console.error('Failed to unlike work:', error);
    throw error;
  }
});

export { worksRoutes };