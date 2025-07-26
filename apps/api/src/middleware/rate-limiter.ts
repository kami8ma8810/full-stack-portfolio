/**
 * レート制限ミドルウェア
 * 
 * DDoS攻撃やAPIの過剰使用を防ぐため、
 * IPアドレスごとにリクエスト数を制限します。
 * 
 * Cloudflare Workers KVを使用してカウンターを保存します。
 */

import { Context, Next } from 'hono';
import { HTTPException } from 'hono/http-exception';

/**
 * レート制限の設定
 */
const RATE_LIMIT_CONFIG = {
  // 時間窓（秒）
  windowSeconds: 60,
  // 時間窓内の最大リクエスト数
  maxRequests: 60,
  // 除外するパス（ヘルスチェックなど）
  excludePaths: ['/health', '/api'],
} as const;

/**
 * クライアントのIPアドレスを取得
 * Cloudflare Workersでは、CF-Connecting-IPヘッダーから取得
 */
function getClientIp(c: Context): string {
  return c.req.header('CF-Connecting-IP') || 
         c.req.header('X-Forwarded-For')?.split(',')[0] || 
         'unknown';
}

/**
 * レート制限チェック関数
 */
export async function rateLimiter(c: Context, next: Next) {
  // 除外パスの場合はスキップ
  if (RATE_LIMIT_CONFIG.excludePaths.includes(c.req.path)) {
    return next();
  }

  const ip = getClientIp(c);
  const key = `rate_limit:${ip}`;
  
  try {
    // KVからカウンターを取得
    const currentCount = await c.env.CACHE.get(key);
    const count = currentCount ? parseInt(currentCount, 10) : 0;
    
    // レート制限をチェック
    if (count >= RATE_LIMIT_CONFIG.maxRequests) {
      // レート制限に達した場合
      throw new HTTPException(429, {
        message: 'Too many requests. Please try again later.',
      });
    }
    
    // カウンターをインクリメント
    await c.env.CACHE.put(
      key,
      String(count + 1),
      {
        expirationTtl: RATE_LIMIT_CONFIG.windowSeconds,
      },
    );
    
    // レート制限情報をヘッダーに追加
    c.header('X-RateLimit-Limit', String(RATE_LIMIT_CONFIG.maxRequests));
    c.header('X-RateLimit-Remaining', String(RATE_LIMIT_CONFIG.maxRequests - count - 1));
    c.header('X-RateLimit-Reset', String(Date.now() + RATE_LIMIT_CONFIG.windowSeconds * 1000));
    
  } catch (error) {
    // KVエラーの場合はログを出力してリクエストを通す
    // （レート制限が機能しなくてもサービスは継続）
    if (error instanceof HTTPException) {
      throw error;
    }
    console.error('Rate limiter error:', error);
  }
  
  return next();
}