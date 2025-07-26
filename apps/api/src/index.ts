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
import { timing } from 'hono/timing';

import type { Bindings } from './types/bindings';
import { blogRoutes } from './routes/blog';
import { worksRoutes } from './routes/works';
import { contactRoutes } from './routes/contact';
import { statsRoutes } from './routes/stats';
import { cspReportRoutes } from './routes/csp-report';
import { errorHandler } from './middleware/error-handler';
import { rateLimiter } from './middleware/rate-limiter';
import { getSecurityHeadersConfig, getCorsOrigin, type SecureHeadersVariables } from './middleware/security-headers';

/**
 * Honoアプリケーションのインスタンスを作成
 * Bindingsの型を指定することで、環境変数やバインディングの型安全性を確保
 * SecureHeadersVariablesを追加してNonce対応
 */
type Variables = SecureHeadersVariables;
const app = new Hono<{ Bindings: Bindings; Variables: Variables }>();

/**
 * グローバルミドルウェアの設定
 * すべてのリクエストに対して適用される共通処理
 */

// CORS設定：フロントエンドからのアクセスを許可
app.use(
  '*',
  cors({
    origin: (origin, c) => {
      // セキュリティを強化したCORS設定
      return getCorsOrigin(origin || '', c.env);
    },
    allowHeaders: ['Content-Type', 'Authorization'],
    allowMethods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    exposeHeaders: ['X-Total-Count', 'X-RateLimit-Limit', 'X-RateLimit-Remaining'],
    maxAge: 86400, // プリフライトリクエストのキャッシュ時間（24時間）
    credentials: true,
  }),
);

// セキュリティヘッダーの設定（環境に応じた設定を適用）
app.use('*', async (c, next) => {
  const config = getSecurityHeadersConfig(c.env);
  return config(c, next);
});

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
app.route('/api/csp-report', cspReportRoutes);

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