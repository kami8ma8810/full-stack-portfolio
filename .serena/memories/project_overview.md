# プロジェクト概要

## プロジェクト目的
フロントエンドエンジニアのポートフォリオサイト（ブログ機能付き）を構築するプロジェクト。モダンな技術スタックを使用し、Notion APIと連携したブログ機能、GitHub統計、WakaTimeのコーディング時間表示などの機能を提供。

## 技術スタック
- **Frontend**: Next.js 14 (App Router), TypeScript, Tailwind CSS
- **Backend**: Hono, Cloudflare Workers
- **Database**: Cloudflare D1 (SQLite)
- **Storage**: Cloudflare R2
- **CMS**: Notion API
- **Testing**: Storybook, Playwright, Vitest
- **Package Manager**: pnpm (Monorepo with Turborepo)
- **Internationalization**: next-intl（日本語/英語対応）

## プロジェクト構成
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
└── docs/                    # プロジェクトドキュメント
```

## 現在のファイル構成（apps/web）
- `/src/app/[locale]/` - 多言語対応のページ構成
- `/src/components/` - コンポーネント（home, layout, contact, about, blog, works等）
- `/src/lib/` - ユーティリティとAPI関連
- `/src/hooks/` - カスタムフック
- `/src/config/` - 設定ファイル

## デザインシステム
2025年トレンドを取り入れたブルータリズム風デザイン：
- **カラーパレット**: 黒背景に黄色アクセント（#FFFF00）
- **フォント**: Inter Variable（可変フォント）、JetBrains Mono
- **エフェクト**: brutalist-border, brutalist-button
- **レイアウト**: 非対称グリッド、レイヤード構成