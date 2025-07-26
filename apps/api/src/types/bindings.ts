/**
 * Cloudflare Workersの環境変数とバインディングの型定義
 * 
 * Cloudflare Workersでは、環境変数や各種サービス（D1、R2、KV等）への
 * アクセスは「バインディング」という仕組みを通じて行われます。
 * このファイルでは、それらの型を定義しています。
 */

/**
 * Cloudflare Workersのバインディング型
 */
export interface Bindings {
  /**
   * 環境変数
   */
  // 実行環境（development/production）
  ENVIRONMENT: 'development' | 'production';
  
  // Notion API関連
  NOTION_API_KEY: string;
  NOTION_BLOG_DATABASE_ID: string;
  
  // GitHub API関連
  GITHUB_TOKEN: string;
  GITHUB_USERNAME: string;
  
  // WakaTime API関連
  WAKATIME_API_KEY: string;
  
  // 通知関連（オプション）
  SLACK_WEBHOOK_URL?: string;
  
  /**
   * D1データベース
   * Cloudflare D1はSQLiteベースのデータベースサービス
   */
  DB: D1Database;
  
  /**
   * R2バケット
   * Cloudflare R2はS3互換のオブジェクトストレージ
   */
  BUCKET: R2Bucket;
  
  /**
   * KVネームスペース
   * Cloudflare Workers KVはキーバリューストア
   * 主にキャッシュ用途で使用
   */
  CACHE: KVNamespace;
}

/**
 * 環境変数の型ガード関数
 * 必須の環境変数が設定されているかチェック
 */
export function validateEnv(env: Bindings): void {
  const required = [
    'NOTION_API_KEY',
    'NOTION_BLOG_DATABASE_ID',
    'GITHUB_TOKEN',
    'GITHUB_USERNAME',
  ] as const;
  
  const missing = required.filter((key) => !env[key]);
  
  if (missing.length > 0) {
    throw new Error(`Missing required environment variables: ${missing.join(', ')}`);
  }
}