# 推奨コマンドリスト

## 開発コマンド

### 基本的な開発作業
```bash
# 開発サーバーの起動
pnpm dev

# ビルド
pnpm build

# テスト実行
pnpm test

# 型チェック
pnpm type-check

# リンティング
pnpm lint

# フォーマット
pnpm format
```

### E2Eテスト（Playwright）
```bash
# E2Eテスト実行
pnpm test:e2e

# E2EテストのUIモード
pnpm test:e2e:ui

# テストの検証
pnpm test:verify
```

## アーキテクチャ関連

### モノレポ管理（Turborepo）
```bash
# 全パッケージのdev起動
turbo dev

# 全パッケージのビルド
turbo build

# 特定のパッケージでコマンド実行
turbo run build --filter=@portfolio/web
```

### 国際化（next-intl）
- メッセージファイル: `/messages/ja.json`, `/messages/en.json`
- デフォルト言語: 日本語
- URL構造: `/ja/...`, `/en/...`

## デプロイ関連

### Frontend（Vercel）
```bash
# Vercelデプロイ
vercel

# 環境変数設定
vercel env add NEXT_PUBLIC_API_URL
```

### Backend（Cloudflare Workers）
```bash
cd apps/api
wrangler deploy
```

## 重要なファイルパス
- フロントエンド: `/apps/web/`
- API: `/apps/api/`
- 共通UI: `/packages/ui/`
- 型定義: `/packages/types/`
- 設定: `/packages/config/`