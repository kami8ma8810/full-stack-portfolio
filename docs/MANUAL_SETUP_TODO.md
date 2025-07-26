# 手動設定TODOリスト

このドキュメントは、開発者が手動で設定する必要がある項目をまとめたものです。チェックボックスを使って進捗を管理してください。

## 📝 Notion API設定

### 1. Notionインテグレーション作成
- [ ] [Notion Developers](https://developers.notion.com/)にアクセス
- [ ] 「New integration」をクリックして新規インテグレーション作成
- [ ] インテグレーション名を設定（例：「Portfolio Blog」）
- [ ] 「Internal Integration」を選択
- [ ] 必要な権限を設定：
  - [ ] Read content
  - [ ] Read comments（必要に応じて）
- [ ] APIキーをコピーして保存

### 2. ブログ用データベース作成
- [ ] Notionで新規データベースを作成（Full page推奨）
- [ ] 以下のプロパティを追加：
  - [ ] Title（タイトル）- Title型
  - [ ] Slug（URL用）- Text型
  - [ ] Status - Select型（値：draft, published）
  - [ ] Published（公開日）- Date型
  - [ ] Tags - Multi-select型
  - [ ] Description（概要）- Text型
- [ ] データベースIDを取得（URLから）
  - 例：`https://notion.so/xxxxx?v=yyyyy` の `xxxxx` 部分

### 3. インテグレーションの接続
- [ ] 作成したデータベースの右上「...」メニューから「Connections」を選択
- [ ] 作成したインテグレーションを追加

### 4. 環境変数への設定
- [ ] `apps/api/.dev.vars`に追加：
  ```
  NOTION_API_KEY=secret_xxxxxxxxxxxxx
  NOTION_BLOG_DATABASE_ID=xxxxxxxxxxxxx
  ```

## ☁️ Cloudflare設定

### 1. Cloudflareアカウント
- [ ] [Cloudflare](https://dash.cloudflare.com/)でアカウント作成
- [ ] 二要素認証を有効化

### 2. Wrangler CLI設定
- [ ] `wrangler login`でCloudflareアカウントにログイン
- [ ] アカウントIDを確認：`wrangler whoami`

### 3. D1データベース作成
- [ ] データベース作成：
  ```bash
  cd apps/api
  wrangler d1 create portfolio-db
  ```
- [ ] 出力されたdatabase_idをメモ
- [ ] `wrangler.toml`のdatabase_idを更新：
  ```toml
  [[d1_databases]]
  binding = "DB"
  database_name = "portfolio-db"
  database_id = "実際のID" # ← ここを更新
  ```
- [ ] スキーマ適用：
  ```bash
  wrangler d1 execute portfolio-db --file=./src/db/schema.sql
  ```

### 4. KVネームスペース作成
- [ ] KV作成：
  ```bash
  wrangler kv:namespace create CACHE
  ```
- [ ] 出力されたidをメモ
- [ ] `wrangler.toml`のKV idを更新：
  ```toml
  [[kv_namespaces]]
  binding = "CACHE"
  id = "実際のID" # ← ここを更新
  ```

### 5. R2バケット作成
- [ ] R2バケット作成：
  ```bash
  wrangler r2 bucket create portfolio-assets
  ```
- [ ] CORSポリシー設定：
  ```bash
  wrangler r2 bucket cors put portfolio-assets --rules '[
    {
      "allowedOrigins": ["https://yourdomain.com"],
      "allowedMethods": ["GET", "PUT", "POST", "DELETE"],
      "allowedHeaders": ["*"],
      "maxAgeSeconds": 3600
    }
  ]'
  ```

### 6. 本番環境の環境変数設定
- [ ] Cloudflare Dashboardから設定、または：
  ```bash
  wrangler secret put NOTION_API_KEY
  wrangler secret put NOTION_BLOG_DATABASE_ID
  wrangler secret put GITHUB_TOKEN
  wrangler secret put GITHUB_USERNAME
  wrangler secret put WAKATIME_API_KEY # オプション
  wrangler secret put SLACK_WEBHOOK_URL # オプション
  ```

## 🌐 ドメイン設定

### 1. ドメイン取得
- [ ] ドメインを取得（お好みのレジストラーで）
- [ ] 例：`your-name.dev`、`your-portfolio.com`など

### 2. コード内のドメイン更新
以下のファイルで`portfolio.example.com`を実際のドメインに置き換え：

- [ ] `apps/api/src/middleware/security-headers.ts`:
  ```typescript
  const productionOrigins = [
    'https://your-actual-domain.com', // ← ここを更新
  ];
  ```

- [ ] `packages/config/src/index.ts`:
  ```typescript
  url: process.env.NEXT_PUBLIC_SITE_URL || 'https://your-actual-domain.com',
  ```

- [ ] `README.md`の本番URL

### 3. Vercel設定（フロントエンド）
- [ ] Vercelでプロジェクト作成
- [ ] カスタムドメイン追加
- [ ] 環境変数設定：
  - [ ] `NEXT_PUBLIC_API_URL`: `https://api.your-domain.com`
  - [ ] `NEXT_PUBLIC_SITE_URL`: `https://your-domain.com`

### 4. Cloudflare設定（API）
- [ ] カスタムドメイン設定：
  ```bash
  wrangler deploy --route api.your-domain.com/*
  ```

## 🔑 外部サービスAPI設定

### GitHub API
- [ ] [GitHub Settings > Developer settings > Personal access tokens](https://github.com/settings/tokens)
- [ ] 「Generate new token (classic)」選択
- [ ] 必要なスコープ：
  - [ ] `read:user`
  - [ ] `read:project`（プロジェクト情報用）
- [ ] トークンをコピーして環境変数に設定

### WakaTime API（オプション）
- [ ] [WakaTime Settings](https://wakatime.com/settings/account)
- [ ] 「Secret API Key」をコピー
- [ ] 環境変数に設定

### Slack Webhook（オプション）
- [ ] Slackワークスペースで「Incoming Webhooks」アプリを追加
- [ ] Webhook URLをコピー
- [ ] 環境変数に設定

## 📧 メール設定（将来的に必要な場合）

### SendGrid/Resend等の設定
- [ ] アカウント作成
- [ ] APIキー取得
- [ ] ドメイン認証（SPF/DKIM設定）
- [ ] 環境変数に設定

## 🚀 デプロイ前の最終確認

### セキュリティ
- [ ] すべての環境変数が本番用に設定されている
- [ ] `.env.local`や`.dev.vars`がGitにコミットされていない
- [ ] APIキーやトークンが直接コードに書かれていない

### ドメイン
- [ ] すべてのハードコードされたURLが実際のドメインに更新されている
- [ ] CORS設定が本番ドメインを許可している
- [ ] CSP設定でAPIドメインが許可されている

### API設定
- [ ] Notion APIが正しく接続できる
- [ ] GitHub APIでデータが取得できる
- [ ] レート制限が本番用に調整されている

## 📅 定期メンテナンス

### 月次
- [ ] APIキーのローテーション検討
- [ ] アクセスログの確認
- [ ] エラーログの確認

### 四半期
- [ ] 依存関係の更新
- [ ] セキュリティ監査
- [ ] バックアップの確認

---

**注意**: このドキュメントは定期的に更新し、新しい設定項目が必要になった場合は追記すること。