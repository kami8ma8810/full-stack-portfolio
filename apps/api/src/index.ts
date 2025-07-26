/**
 * Cloudflare Workers用のHono APIエントリーポイント
 * 
 * このファイルは、Cloudflare Workersで動作するAPIサーバーのメインファイルです。
 * Honoフレームワークを使用して、軽量で高速なAPIを構築しています。
 */

import { Hono } from 'hono';
import { cors } from 'hono/cors';
import { logger } from 'hono/logger';
import { prettyJSON } from 'hono/pretty-json';
import { secureHeaders } from 'hono/secure-headers';
import { timing } from 'hono/timing';

import type { Bindings } from './types/bindings';
import { blogRoutes } from './routes/blog';
import { worksRoutes } from './routes/works';
import { contactRoutes } from './routes/contact';
import { statsRoutes } from './routes/stats';
import { errorHandler } from './middleware/error-handler';
import { rateLimiter } from './middleware/rate-limiter';

/**
 * Honoアプリケーションのインスタンスを作成
 * Bindingsの型を指定することで、環境変数やバインディングの型安全性を確保
 */
const app = new Hono<{ Bindings: Bindings }>();

/**
 * グローバルミドルウェアの設定
 * すべてのリクエストに対して適用される共通処理
 */

// CORS設定：フロントエンドからのアクセスを許可
app.use(
  '*',
  cors({
    origin: (origin) => {
      // 開発環境と本番環境のオリジンを許可
      const allowedOrigins = [
        'http://localhost:3000',
        'https://portfolio.example.com', // 本番URLに置き換え
      ];
      return allowedOrigins.includes(origin) ? origin : allowedOrigins[0];
    },
    allowHeaders: ['Content-Type', 'Authorization'],
    allowMethods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    exposeHeaders: ['X-Total-Count'], // ページネーション用
    maxAge: 86400, // プリフライトリクエストのキャッシュ時間（24時間）
    credentials: true,
  }),
);

// セキュリティヘッダーの設定
app.use('*', secureHeaders());

// リクエストログの出力（開発環境のみ推奨）
app.use('*', logger());

// レスポンスタイミングの計測
app.use('*', timing());

// JSON整形（開発環境のみ有効化）
app.use('*', async (c, next) => {
  if (c.env.ENVIRONMENT === 'development') {
    return prettyJSON()(c, next);
  }
  await next();
});

// レート制限の適用
app.use('*', rateLimiter);

// エラーハンドリング
app.onError(errorHandler);

/**
 * ヘルスチェックエンドポイント
 * サービスの稼働状態を確認するために使用
 */
app.get('/health', (c) => {
  return c.json({
    status: 'ok',
    timestamp: new Date().toISOString(),
    environment: c.env.ENVIRONMENT || 'unknown',
  });
});

/**
 * APIバージョン情報
 */
app.get('/api', (c) => {
  return c.json({
    name: 'Portfolio API',
    version: '1.0.0',
    endpoints: {
      blog: '/api/blog',
      works: '/api/works',
      contact: '/api/contact',
      stats: '/api/stats',
    },
  });
});

/**
 * 各機能のルートをマウント
 * それぞれのルートは独立したファイルで管理
 */
app.route('/api/blog', blogRoutes);
app.route('/api/works', worksRoutes);
app.route('/api/contact', contactRoutes);
app.route('/api/stats', statsRoutes);

/**
 * 404ハンドラー
 * 定義されていないルートへのアクセス時の処理
 */
app.notFound((c) => {
  return c.json(
    {
      error: 'Not Found',
      message: 'The requested resource was not found',
      path: c.req.path,
    },
    404,
  );
});

/**
 * Cloudflare Workersのエクスポート
 * fetchハンドラーをデフォルトエクスポート
 */
export default app;