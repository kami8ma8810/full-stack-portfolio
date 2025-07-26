/**
 * Cookie設定ユーティリティ
 * 
 * セキュアなCookie設定を提供するヘルパー関数
 */

/**
 * セキュアなCookie設定オプション
 */
export interface SecureCookieOptions {
  httpOnly?: boolean;
  secure?: boolean;
  sameSite?: 'Strict' | 'Lax' | 'None';
  maxAge?: number;
  path?: string;
  domain?: string;
}

/**
 * デフォルトのセキュアなCookie設定
 * 
 * @param env - 環境変数
 * @returns Cookie設定オプション
 */
export function getSecureCookieOptions(env: { ENVIRONMENT: string }): SecureCookieOptions {
  return {
    httpOnly: true, // XSS対策：JavaScriptからアクセス不可
    secure: env.ENVIRONMENT === 'production', // HTTPS必須（本番環境）
    sameSite: 'Lax', // CSRF対策
    path: '/',
    // domainは指定しない（より安全）
  };
}

/**
 * 認証用Cookieの設定
 * より厳格なセキュリティ設定
 * 
 * @param env - 環境変数
 * @returns 認証用Cookie設定
 */
export function getAuthCookieOptions(env: { ENVIRONMENT: string }): SecureCookieOptions {
  return {
    ...getSecureCookieOptions(env),
    sameSite: 'Strict', // より厳格なCSRF対策
    maxAge: 60 * 60 * 24 * 7, // 7日間
  };
}

/**
 * セキュアなCookie名を生成
 * __Host-プレフィックスを使用してセキュリティを強化
 * 
 * @param name - Cookie名
 * @param env - 環境変数
 * @returns セキュアなCookie名
 */
export function getSecureCookieName(name: string, env: { ENVIRONMENT: string }): string {
  // 本番環境では__Host-プレフィックスを使用
  // （Path=/、Secure必須、Domain属性なしを強制）
  if (env.ENVIRONMENT === 'production') {
    return `__Host-${name}`;
  }
  
  // 開発環境では通常の名前
  return name;
}