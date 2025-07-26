/**
 * 統計情報関連のAPIルート
 * 
 * GitHubやWakaTimeから統計情報を取得し、
 * フロントエンドに提供します。
 */

import { Hono } from 'hono';
import type { Bindings } from '../types/bindings';
import { GitHubService } from '../services/github';
import { WakaTimeService } from '../services/wakatime';
import { StatsService } from '../services/stats';
import type { GitHubStats, WakaTimeStats } from '@portfolio/types';

const statsRoutes = new Hono<{ Bindings: Bindings }>();

/**
 * GET /api/stats/github
 * GitHub統計情報を取得
 */
statsRoutes.get('/github', async (c) => {
  const githubService = new GitHubService(c.env);
  const statsService = new StatsService(c.env);

  try {
    // キャッシュをチェック
    const cached = await statsService.getCachedStats<GitHubStats>('github');
    if (cached) {
      c.header('X-Cache', 'HIT');
      return c.json(cached);
    }

    // GitHub APIから統計情報を取得
    const stats = await githubService.getUserStats();

    // キャッシュに保存（24時間）
    await statsService.cacheStats('github', stats, 86400);

    c.header('X-Cache', 'MISS');
    return c.json(stats);
  } catch (error) {
    console.error('Failed to fetch GitHub stats:', error);
    
    // エラー時は空のデータを返す（サービスの継続性を優先）
    return c.json<GitHubStats>({
      username: c.env.GITHUB_USERNAME,
      totalContributions: 0,
      totalStars: 0,
      followers: 0,
      languages: [],
    });
  }
});

/**
 * GET /api/stats/wakatime
 * WakaTime統計情報を取得
 */
statsRoutes.get('/wakatime', async (c) => {
  const wakatimeService = new WakaTimeService(c.env);
  const statsService = new StatsService(c.env);

  // WakaTime APIキーが設定されていない場合
  if (!c.env.WAKATIME_API_KEY) {
    return c.json<WakaTimeStats>({
      totalHoursThisWeek: 0,
      dailyAverage: 0,
      languages: [],
      editors: [],
    });
  }

  try {
    // キャッシュをチェック
    const cached = await statsService.getCachedStats<WakaTimeStats>('wakatime');
    if (cached) {
      c.header('X-Cache', 'HIT');
      return c.json(cached);
    }

    // WakaTime APIから統計情報を取得
    const stats = await wakatimeService.getWeeklyStats();

    // キャッシュに保存（1時間）
    await statsService.cacheStats('wakatime', stats, 3600);

    c.header('X-Cache', 'MISS');
    return c.json(stats);
  } catch (error) {
    console.error('Failed to fetch WakaTime stats:', error);
    
    // エラー時は空のデータを返す
    return c.json<WakaTimeStats>({
      totalHoursThisWeek: 0,
      dailyAverage: 0,
      languages: [],
      editors: [],
    });
  }
});

/**
 * GET /api/stats/summary
 * 統計情報のサマリーを取得
 */
statsRoutes.get('/summary', async (c) => {
  const githubService = new GitHubService(c.env);
  const wakatimeService = new WakaTimeService(c.env);
  const statsService = new StatsService(c.env);

  try {
    // 並列で統計情報を取得
    const [githubStats, wakatimeStats] = await Promise.all([
      (async () => {
        const cached = await statsService.getCachedStats<GitHubStats>('github');
        return cached || await githubService.getUserStats();
      })(),
      (async () => {
        if (!c.env.WAKATIME_API_KEY) {
          return null;
        }
        const cached = await statsService.getCachedStats<WakaTimeStats>('wakatime');
        return cached || await wakatimeService.getWeeklyStats();
      })(),
    ]);

    // サマリー情報を作成
    const summary = {
      github: {
        contributions: githubStats.totalContributions,
        stars: githubStats.totalStars,
        followers: githubStats.followers,
        topLanguage: githubStats.languages[0]?.name || 'N/A',
      },
      wakatime: wakatimeStats ? {
        weeklyHours: Math.round(wakatimeStats.totalHoursThisWeek),
        dailyAverage: Math.round(wakatimeStats.dailyAverage * 10) / 10,
        topLanguage: wakatimeStats.languages[0]?.name || 'N/A',
      } : null,
      lastUpdated: new Date().toISOString(),
    };

    return c.json(summary);
  } catch (error) {
    console.error('Failed to fetch stats summary:', error);
    
    // エラー時は部分的なデータでも返す
    return c.json({
      github: {
        contributions: 0,
        stars: 0,
        followers: 0,
        topLanguage: 'N/A',
      },
      wakatime: null,
      lastUpdated: new Date().toISOString(),
    });
  }
});

export { statsRoutes };