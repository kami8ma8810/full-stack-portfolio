-- Cloudflare D1データベーススキーマ
-- 
-- このファイルは、D1データベースの初期化時に実行するSQLです。
-- SQLiteベースなので、SQLiteの構文を使用します。

-- ブログ記事のビュー数管理テーブル
CREATE TABLE IF NOT EXISTS blog_views (
    slug TEXT PRIMARY KEY,              -- 記事のURL識別子
    view_count INTEGER DEFAULT 0,       -- 総閲覧数
    last_viewed_at DATETIME,           -- 最終閲覧日時
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- ビュー数更新時のタイムスタンプ自動更新用トリガー
CREATE TRIGGER IF NOT EXISTS update_blog_views_timestamp 
AFTER UPDATE ON blog_views
BEGIN
    UPDATE blog_views SET updated_at = CURRENT_TIMESTAMP WHERE slug = NEW.slug;
END;

-- お問い合わせ情報テーブル
CREATE TABLE IF NOT EXISTS contacts (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,                -- お名前
    email TEXT NOT NULL,               -- メールアドレス
    message TEXT NOT NULL,             -- メッセージ本文
    ip_address TEXT,                   -- IPアドレス（スパム対策）
    user_agent TEXT,                   -- ユーザーエージェント
    status TEXT DEFAULT 'unread',      -- ステータス（unread/read/replied）
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- メールアドレスのインデックス（検索高速化）
CREATE INDEX IF NOT EXISTS idx_contacts_email ON contacts(email);
CREATE INDEX IF NOT EXISTS idx_contacts_status ON contacts(status);

-- プロジェクト統計情報テーブル
CREATE TABLE IF NOT EXISTS project_stats (
    project_id TEXT PRIMARY KEY,       -- プロジェクトID
    likes INTEGER DEFAULT 0,           -- いいね数
    views INTEGER DEFAULT 0,           -- ビュー数
    last_interacted_at DATETIME,       -- 最終インタラクション日時
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- プロジェクト統計更新時のタイムスタンプ自動更新用トリガー
CREATE TRIGGER IF NOT EXISTS update_project_stats_timestamp 
AFTER UPDATE ON project_stats
BEGIN
    UPDATE project_stats SET updated_at = CURRENT_TIMESTAMP WHERE project_id = NEW.project_id;
END;

-- キャッシュエントリーテーブル（D1でのキャッシュ管理用）
CREATE TABLE IF NOT EXISTS cache_entries (
    key TEXT PRIMARY KEY,              -- キャッシュキー
    value TEXT NOT NULL,               -- キャッシュ値（JSON形式）
    expires_at DATETIME NOT NULL,      -- 有効期限
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- 期限切れキャッシュ検索用インデックス
CREATE INDEX IF NOT EXISTS idx_cache_expires ON cache_entries(expires_at);

-- APIアクセスログテーブル（分析用、オプション）
CREATE TABLE IF NOT EXISTS api_logs (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    method TEXT NOT NULL,              -- HTTPメソッド
    path TEXT NOT NULL,                -- リクエストパス
    status_code INTEGER,               -- レスポンスステータスコード
    response_time INTEGER,             -- レスポンス時間（ミリ秒）
    ip_address TEXT,                   -- クライアントIP
    user_agent TEXT,                   -- ユーザーエージェント
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- APIログ検索用インデックス
CREATE INDEX IF NOT EXISTS idx_api_logs_path ON api_logs(path);
CREATE INDEX IF NOT EXISTS idx_api_logs_created ON api_logs(created_at);