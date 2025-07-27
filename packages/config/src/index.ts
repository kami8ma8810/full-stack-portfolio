/**
 * 環境変数から値を取得する関数
 * クライアントサイドでも安全に使用できる
 */
const getEnvValue = (key: string, defaultValue: string): string => {
  if (typeof window === 'undefined') {
    // サーバーサイド
    return process.env[key] || defaultValue;
  }
  // クライアントサイド - NEXT_PUBLIC_プレフィックスのある環境変数のみ利用可能
  return defaultValue;
};

/**
 * サイト全体の設定
 */
export const siteConfig = {
  /** サイト名 */
  name: 'Portfolio',
  /** サイトの説明 */
  description: 'フロントエンドエンジニアのポートフォリオサイト',
  /** サイトのURL（本番環境） */
  url: 'https://example.com',
  /** 作者情報 */
  author: {
    name: 'Your Name',
    email: 'your-email@example.com',
    github: 'https://github.com/yourusername',
    twitter: 'https://twitter.com/yourusername',
    linkedin: 'https://linkedin.com/in/yourusername',
  },
  /** SEO関連の設定 */
  seo: {
    keywords: ['フロントエンドエンジニア', 'ポートフォリオ', 'React', 'Next.js', 'TypeScript'],
  },
} as const;

/**
 * API関連の設定
 */
export const apiConfig = {
  /** APIのベースURL */
  baseUrl: 'http://localhost:8787',
  /** APIのエンドポイント */
  endpoints: {
    blog: '/api/blog',
    works: '/api/works',
    contact: '/api/contact',
    stats: {
      github: '/api/stats/github',
      wakatime: '/api/stats/wakatime',
    },
  },
  /** リクエストのタイムアウト時間（ミリ秒） */
  timeout: 30000,
} as const;

/**
 * Notion API関連の設定
 */
export const notionConfig = {
  /** Notion APIのバージョン */
  apiVersion: '2022-06-28',
  /** ブログ用データベースID（環境変数から取得） */
  blogDatabaseId: getEnvValue('NOTION_BLOG_DATABASE_ID', ''),
} as const;

/**
 * Cloudflare関連の設定
 */
export const cloudflareConfig = {
  /** R2バケット名 */
  r2BucketName: getEnvValue('R2_BUCKET_NAME', 'portfolio-assets'),
  /** D1データベース名 */
  d1DatabaseName: 'portfolio-db',
} as const;

/**
 * 外部サービスの設定
 */
export const externalServicesConfig = {
  /** GitHub API設定 */
  github: {
    username: getEnvValue('GITHUB_USERNAME', ''),
    token: getEnvValue('GITHUB_TOKEN', ''),
  },
  /** WakaTime API設定 */
  wakatime: {
    apiKey: getEnvValue('WAKATIME_API_KEY', ''),
  },
} as const;

/**
 * ページネーション設定
 */
export const paginationConfig = {
  /** デフォルトのページサイズ */
  defaultPageSize: 10,
  /** 最大ページサイズ */
  maxPageSize: 100,
} as const;

/**
 * キャッシュ設定
 */
export const cacheConfig = {
  /** ブログ記事のキャッシュ時間（秒） */
  blogPostTTL: 3600, // 1時間
  /** 統計情報のキャッシュ時間（秒） */
  statsTTL: 86400, // 24時間
  /** 作品情報のキャッシュ時間（秒） */
  worksTTL: 3600, // 1時間
} as const;

/**
 * 開発環境かどうかを判定
 */
export const isDevelopment = getEnvValue('NODE_ENV', 'development') === 'development';

/**
 * 本番環境かどうかを判定
 */
export const isProduction = getEnvValue('NODE_ENV', 'development') === 'production';