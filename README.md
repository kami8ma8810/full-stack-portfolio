# Full Stack Portfolio

フロントエンドエンジニアのポートフォリオサイト（ブログ機能付き）

## 🚀 概要

このプロジェクトは、モダンな技術スタックを使用したポートフォリオサイトです。ブログ機能を備え、GitHub統計やWakaTimeのコーディング時間などを表示できます。

### 主な機能

- 📝 **ブログ**: Notion APIと連携した記事管理
- 💼 **ポートフォリオ**: 制作実績の紹介
- 📊 **統計表示**: GitHub貢献度、言語使用率、コーディング時間
- 🎨 **Playground**: 技術デモやアニメーション実験
- 📧 **お問い合わせ**: フォームからの連絡機能

## 🛠 技術スタック

- **Frontend**: Next.js 14 (App Router), TypeScript, Tailwind CSS
- **Backend**: Hono, Cloudflare Workers
- **Database**: Cloudflare D1 (SQLite)
- **Storage**: Cloudflare R2
- **CMS**: Notion API
- **Testing**: Storybook, Playwright, Vitest
- **Package Manager**: pnpm (Monorepo with Turborepo)

## 📁 プロジェクト構成

```
full-stack-portfolio/
├── apps/
│   ├── web/                 # Next.js フロントエンド
│   └── api/                 # Hono バックエンドAPI
├── packages/
│   ├── ui/                  # 共通UIコンポーネント
│   ├── types/               # 共通型定義
│   └── config/              # 共通設定
├── infrastructure/          # インフラ設定
│   ├── cloudflare/         # Cloudflare設定
│   └── vercel/             # Vercel設定
└── docs/                    # プロジェクトドキュメント
```

## 🚀 セットアップ

### 前提条件

- Node.js 22以上
- pnpm 9.15.0以上
- Cloudflareアカウント
- Notionアカウント（ブログ機能を使用する場合）

#### Node.jsバージョン管理

プロジェクトではNode.js v22を使用しています。以下のツールでバージョンを管理できます：

```bash
# nvmを使用する場合
nvm use

# fnmを使用する場合
fnm use

# asdfを使用する場合
asdf install
```

### 1. リポジトリのクローン

```bash
git clone https://github.com/yourusername/full-stack-portfolio.git
cd full-stack-portfolio
```

### 2. 依存関係のインストール

```bash
pnpm install
```

### 3. 環境変数の設定

各アプリケーションのディレクトリに`.env.local`ファイルを作成します。

#### apps/web/.env.local
```bash
# API設定
NEXT_PUBLIC_API_URL=http://localhost:8787

# サイト設定
NEXT_PUBLIC_SITE_URL=http://localhost:3000
```

#### apps/api/.dev.vars
```bash
# Notion API
NOTION_API_KEY=your_notion_api_key
NOTION_BLOG_DATABASE_ID=your_database_id

# GitHub API
GITHUB_TOKEN=your_github_token
GITHUB_USERNAME=your_github_username

# WakaTime API
WAKATIME_API_KEY=your_wakatime_api_key

# Cloudflare R2
R2_BUCKET_NAME=portfolio-assets
R2_ACCESS_KEY_ID=your_access_key_id
R2_SECRET_ACCESS_KEY=your_secret_access_key
```

### 4. Cloudflare D1データベースのセットアップ

```bash
# APIディレクトリに移動
cd apps/api

# D1データベースの作成
wrangler d1 create portfolio-db

# マイグレーションの実行
wrangler d1 execute portfolio-db --file=./src/db/schema.sql
```

### 5. 開発サーバーの起動

```bash
# ルートディレクトリから
pnpm dev
```

以下のURLでアクセスできます：
- Frontend: http://localhost:3000
- Backend API: http://localhost:8787

## 📝 Notion設定

ブログ機能を使用するには、Notionで以下の設定が必要です：

1. Notionインテグレーションを作成
2. ブログ用のデータベースを作成
3. 以下のプロパティを追加：
   - Title (タイトル)
   - Slug (URL用)
   - Status (draft/published)
   - Published (公開日)
   - Tags (タグ)
   - Description (概要)

## 🧪 テスト

```bash
# ユニットテスト
pnpm test

# E2Eテスト
pnpm test:e2e

# Storybookの起動
pnpm storybook
```

## 🚀 デプロイ

### Frontend (Vercel)

```bash
# Vercelにデプロイ
vercel

# 環境変数を設定
vercel env add NEXT_PUBLIC_API_URL
vercel env add NEXT_PUBLIC_SITE_URL
```

### Backend (Cloudflare Workers)

```bash
cd apps/api
wrangler deploy
```

### Storybook (Cloudflare Pages)

```bash
# Storybookをビルド
pnpm build-storybook

# Cloudflare Pagesにデプロイ
wrangler pages deploy storybook-static
```

## 📚 ドキュメント

- [アーキテクチャ設計](./ARCHITECTURE.md)
- [API仕様](./docs/API.md)
- [デプロイガイド](./docs/DEPLOYMENT.md)
- [トラブルシューティング](./docs/TROUBLESHOOTING.md)

## 🤝 コントリビューション

プルリクエストを歓迎します！大きな変更を行う場合は、まずissueを作成して変更内容について議論してください。

## 📄 ライセンス

MIT License - 詳細は[LICENSE](./LICENSE)ファイルを参照してください。