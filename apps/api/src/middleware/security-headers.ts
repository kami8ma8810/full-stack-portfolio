/**
 * セキュリティヘッダー設定
 * 
 * Honoの組み込みsecureHeadersミドルウェアのカスタム設定と、
 * CORS設定のヘルパー関数を提供します。
 */

import { secureHeaders as honoSecureHeaders, NONCE } from 'hono/secure-headers';
import type { SecureHeadersVariables } from 'hono/secure-headers';

export type { SecureHeadersVariables };

/**
 * セキュリティヘッダーの設定を取得
 * 2025年のベストプラクティスに基づいた設定
 * 
 * @param env - 環境変数
 * @returns secureHeadersミドルウェアの設定
 */
export function getSecurityHeadersConfig(env: { ENVIRONMENT: string }) {
  const isDevelopment = env.ENVIRONMENT === 'development';
  
  return honoSecureHeaders({
    // Strict Transport Security (HSTS)
    // 本番環境では最大期間（2年）とpreloadを有効化
    strictTransportSecurity: isDevelopment 
      ? 'max-age=86400' // 開発環境では1日
      : 'max-age=63072000; includeSubDomains; preload', // 本番環境では2年
    
    // クリックジャッキング対策
    xFrameOptions: 'DENY',
    
    // MIMEタイプの推測を無効化
    xContentTypeOptions: 'nosniff',
    
    // Referrer Policy
    referrerPolicy: 'strict-origin-when-cross-origin',
    
    // XSS Protection（レガシーブラウザ向け）
    xXssProtection: '1; mode=block',
    
    // Content Security Policy
    // Nonceベースのストリクトなポリシーを使用
    contentSecurityPolicy: {
      // デフォルトは厳格に
      defaultSrc: ["'none'"],
      
      // スクリプト: Nonceベースの動的ポリシー
      scriptSrc: isDevelopment
        ? [NONCE, "'strict-dynamic'", "'unsafe-inline'"] // 開発環境は緩め
        : [NONCE, "'strict-dynamic'"], // 本番環境は厳格
      
      // スタイル
      styleSrc: [NONCE, "'self'", "'unsafe-inline'"], // Tailwind CSSのため
      
      // 画像
      imgSrc: ["'self'", "data:", "https:", "blob:"],
      
      // フォント
      fontSrc: ["'self'", "https:", "data:"],
      
      // API接続先
      connectSrc: [
        "'self'",
        "https://api.github.com",
        "https://wakatime.com",
        "https://api.notion.com",
        isDevelopment ? "http://localhost:*" : "",
      ].filter(Boolean),
      
      // フォーム送信先
      formAction: ["'self'"],
      
      // iframe埋め込み禁止
      frameAncestors: ["'none'"],
      
      // Base URI
      baseUri: ["'self'"],
      
      // オブジェクト埋め込み禁止
      objectSrc: ["'none'"],
      
      // HTTPSへのアップグレード
      upgradeInsecureRequests: isDevelopment ? undefined : [],
      
      // CSP違反レポート
      reportTo: isDevelopment ? undefined : 'csp-endpoint',
    },
    
    // Permissions Policy（Feature Policyの後継）
    permissionsPolicy: {
      camera: ["'none'"],
      microphone: ["'none'"],
      geolocation: ["'none'"],
      accelerometer: ["'none'"],
      gyroscope: ["'none'"],
      magnetometer: ["'none'"],
      usb: ["'none'"],
      payment: ["'none'"],
    },
    
    // Reporting API設定（本番環境のみ）
    reportTo: isDevelopment ? undefined : [
      {
        group: 'csp-endpoint',
        max_age: 10886400, // 126日
        endpoints: [{ url: '/api/csp-report' }],
      },
    ],
    
    // X-Powered-Byヘッダーを削除
    removePoweredBy: true,
    
    // Cross-Origin設定
    crossOriginEmbedderPolicy: false, // SharedArrayBufferを使用しない場合
    crossOriginResourcePolicy: true,
    crossOriginOpenerPolicy: true,
  });
}

/**
 * CORS設定を強化した関数
 * 
 * @param origin - リクエスト元のオリジン
 * @param env - 環境変数
 * @returns 許可するオリジン
 */
export function getCorsOrigin(origin: string, env: { ENVIRONMENT: string }): string {
  // 本番環境の許可オリジン
  const productionOrigins = [
    'https://portfolio.example.com', // TODO: 実際のドメインに変更
  ];
  
  // 開発環境の許可オリジン
  const developmentOrigins = [
    'http://localhost:3000',
    'http://localhost:3001',
  ];
  
  const allowedOrigins = env.ENVIRONMENT === 'production' 
    ? productionOrigins 
    : [...productionOrigins, ...developmentOrigins];
  
  // オリジンが許可リストに含まれているかチェック
  if (allowedOrigins.includes(origin)) {
    return origin;
  }
  
  // デフォルトは最初の許可オリジンを返す
  return allowedOrigins[0];
}