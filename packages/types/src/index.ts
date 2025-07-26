/**
 * ブログ記事の型定義
 */
export interface BlogPost {
  /** NotionページのID */
  id: string;
  /** URL用のスラッグ */
  slug: string;
  /** 記事タイトル */
  title: string;
  /** 記事の概要 */
  description: string;
  /** 公開日 */
  publishedAt: string;
  /** 最終更新日 */
  updatedAt: string;
  /** 記事のステータス */
  status: 'draft' | 'published';
  /** タグのリスト */
  tags: string[];
  /** 記事本文（Markdown形式） */
  content?: string;
  /** ビュー数 */
  viewCount?: number;
}

/**
 * プロジェクト/作品の型定義
 */
export interface Work {
  /** プロジェクトID */
  id: string;
  /** プロジェクト名 */
  title: string;
  /** プロジェクトの説明 */
  description: string;
  /** 使用技術スタック */
  techStack: string[];
  /** プロジェクトのURL（デモサイトなど） */
  demoUrl?: string;
  /** GitHubリポジトリURL */
  githubUrl?: string;
  /** サムネイル画像URL */
  thumbnailUrl: string;
  /** 作成日 */
  createdAt: string;
  /** いいね数 */
  likes?: number;
  /** ビュー数 */
  views?: number;
}

/**
 * お問い合わせフォームの型定義
 */
export interface ContactForm {
  /** お名前 */
  name: string;
  /** メールアドレス */
  email: string;
  /** お問い合わせ内容 */
  message: string;
}

/**
 * GitHub統計情報の型定義
 */
export interface GitHubStats {
  /** GitHubユーザー名 */
  username: string;
  /** 総コントリビューション数 */
  totalContributions: number;
  /** 総スター数 */
  totalStars: number;
  /** 総フォロワー数 */
  followers: number;
  /** 使用言語の統計 */
  languages: {
    name: string;
    percentage: number;
    color: string;
  }[];
}

/**
 * WakaTime統計情報の型定義
 */
export interface WakaTimeStats {
  /** 今週の総コーディング時間 */
  totalHoursThisWeek: number;
  /** 日別のコーディング時間 */
  dailyAverage: number;
  /** 言語別の使用時間 */
  languages: {
    name: string;
    hours: number;
    percentage: number;
  }[];
  /** エディタ別の使用時間 */
  editors: {
    name: string;
    hours: number;
    percentage: number;
  }[];
}

/**
 * APIレスポンスのラッパー型
 */
export interface ApiResponse<T> {
  /** レスポンスデータ */
  data?: T;
  /** エラーメッセージ */
  error?: string;
  /** HTTPステータスコード */
  status: number;
}

/**
 * ページネーション情報
 */
export interface Pagination {
  /** 現在のページ番号 */
  page: number;
  /** 1ページあたりのアイテム数 */
  limit: number;
  /** 総アイテム数 */
  total: number;
  /** 総ページ数 */
  totalPages: number;
}