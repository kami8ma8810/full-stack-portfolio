/**
 * API専用の設定
 * Cloudflare Workers環境で使用するため、process.envは使用しない
 */

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
 * ページネーション設定
 */
export const paginationConfig = {
  /** デフォルトのページサイズ */
  defaultPageSize: 10,
  /** 最大ページサイズ */
  maxPageSize: 100,
} as const;

/**
 * Notion API関連の設定
 */
export const notionConfig = {
  /** Notion APIのバージョン */
  apiVersion: '2022-06-28',
} as const;