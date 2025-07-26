# アーキテクチャ設計

## 📐 システム概要

このポートフォリオサイトは、フロントエンドとバックエンドを分離したモダンなアーキテクチャを採用しています。エッジコンピューティングを活用し、高速なレスポンスと低コストな運用を実現しています。

## 🏗 アーキテクチャ図

```
┌─────────────────┐     ┌─────────────────┐     ┌─────────────────┐
│                 │     │                 │     │                 │
│   Vercel Edge   │────▶│ Cloudflare      │────▶│   Notion API    │
│   (Next.js)     │     │ Workers         │     │                 │
│                 │     │ (Hono)          │     └─────────────────┘
└─────────────────┘     │                 │
         │              │                 │     ┌─────────────────┐
         │              │                 │────▶│  GitHub API     │
         ▼              │                 │     │                 │
┌─────────────────┐     │                 │     └─────────────────┘
│                 │     │                 │
│ Cloudflare CDN  │     │                 │     ┌─────────────────┐
│                 │     │                 │────▶│ WakaTime API    │
└─────────────────┘     │                 │     │                 │
                        └─────────────────┘     └─────────────────┘
                                 │
                                 ▼
                        ┌─────────────────┐     ┌─────────────────┐
                        │                 │     │                 │
                        │ Cloudflare D1   │     │ Cloudflare R2   │
                        │ (SQLite)        │     │ (Object Storage)│
                        │                 │     │                 │
                        └─────────────────┘     └─────────────────┘
```

## 🎯 技術選定の理由

### Frontend: Next.js 14 (App Router)

**選定理由：**
- **React Server Components (RSC)**: サーバーサイドでのコンポーネントレンダリングによりパフォーマンス向上
- **App Router**: より直感的なルーティングとレイアウト管理
- **ISR/SSG対応**: ブログ記事の静的生成とインクリメンタル更新
- **TypeScript標準対応**: 型安全性の確保
- **Vercelとの親和性**: デプロイとホスティングの簡素化

### Backend: Hono + Cloudflare Workers

**選定理由：**
- **軽量・高速**: Honoは非常に軽量なWebフレームワーク（約14KB）
- **エッジコンピューティング**: ユーザーに近い場所でコードを実行
- **無料枠が充実**: 1日10万リクエストまで無料
- **TypeScript対応**: フロントエンドと同じ言語で開発可能
- **Web標準準拠**: Fetch APIベースで将来性が高い

### Database: Cloudflare D1

**選定理由：**
- **SQLite互換**: 開発環境での動作確認が容易
- **エッジで動作**: Workersと同じ場所でデータベースが動作
- **無料枠**: 1GBのストレージ、500万行の読み取りが無料
- **自動レプリケーション**: グローバルな可用性

### Storage: Cloudflare R2

**選定理由：**
- **S3互換API**: 既存のツールやライブラリが使用可能
- **エグレス料金無料**: データ転送料金がかからない
- **10GB/月無料**: 小規模なポートフォリオには十分
- **Workers統合**: 同じCloudflareエコシステム内で完結

### CMS: Notion API

**選定理由：**
- **使い慣れたUI**: 普段使用しているツールでコンテンツ管理
- **リッチなエディタ**: Markdownやコードブロックに対応
- **API提供**: プログラマブルにコンテンツを取得可能
- **無料**: 個人利用は無料

## 🔄 データフロー

### 1. ブログ記事の表示フロー

```
1. ユーザーがブログページにアクセス
2. Next.jsがCloudflare Workers APIを呼び出し
3. WorkersがNotion APIからデータを取得
4. 取得したデータをD1にキャッシュ
5. レスポンスをNext.jsに返却
6. Next.jsがSSG/ISRでページを生成
7. CloudflareのCDNにキャッシュ
```

### 2. 画像アップロードフロー

```
1. 管理画面から画像をアップロード
2. Next.jsがPresigned URLをAPIに要求
3. WorkersがR2のPresigned URLを生成
4. ブラウザから直接R2に画像をアップロード
5. アップロード完了後、メタデータをD1に保存
```

## 🗄 データモデル

### D1 スキーマ設計

```sql
-- ブログのビュー数管理
CREATE TABLE blog_views (
  slug TEXT PRIMARY KEY,              -- 記事のスラッグ（URL識別子）
  view_count INTEGER DEFAULT 0,       -- 総ビュー数
  last_viewed_at DATETIME,           -- 最終閲覧日時
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- お問い合わせ情報
CREATE TABLE contacts (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  name TEXT NOT NULL,                -- お名前
  email TEXT NOT NULL,               -- メールアドレス
  message TEXT NOT NULL,             -- メッセージ本文
  ip_address TEXT,                   -- IPアドレス（スパム対策）
  user_agent TEXT,                   -- ユーザーエージェント
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- プロジェクトの統計情報
CREATE TABLE project_stats (
  project_id TEXT PRIMARY KEY,       -- プロジェクトID
  likes INTEGER DEFAULT 0,           -- いいね数
  views INTEGER DEFAULT 0,           -- ビュー数
  last_updated DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- キャッシュ管理
CREATE TABLE cache_entries (
  key TEXT PRIMARY KEY,              -- キャッシュキー
  value TEXT NOT NULL,               -- キャッシュ値（JSON）
  expires_at DATETIME NOT NULL,      -- 有効期限
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);
```

## 🔐 セキュリティ対策

### 1. API保護
- **レート制限**: Cloudflare Workersでリクエスト数を制限
- **CORS設定**: 許可されたオリジンのみアクセス可能
- **入力検証**: Zodによる厳格なスキーマ検証

### 2. 環境変数管理
- **シークレット管理**: Cloudflare/Vercelの環境変数機能を使用
- **ローカル開発**: `.env.local`ファイルは.gitignoreに追加
- **最小権限の原則**: 各サービスに必要最小限の権限のみ付与

### 3. コンテンツセキュリティ
- **CSP設定**: Content Security Policyの適切な設定
- **XSS対策**: React/Next.jsの自動エスケープ機能
- **SQLインジェクション対策**: プリペアドステートメントの使用

## 🚀 パフォーマンス最適化

### 1. キャッシング戦略
- **CDNキャッシュ**: 静的アセットはCloudflare CDNでキャッシュ
- **APIキャッシュ**: よく使われるデータはD1にキャッシュ
- **ブラウザキャッシュ**: 適切なCache-Controlヘッダー設定

### 2. 画像最適化
- **Next.js Image**: 自動的な画像最適化とレイジーローディング
- **WebP変換**: モダンなフォーマットへの自動変換
- **レスポンシブ画像**: デバイスに応じた画像サイズの配信

### 3. バンドルサイズ最適化
- **コード分割**: 動的インポートによる必要時のみのロード
- **Tree Shaking**: 未使用コードの自動削除
- **圧縮**: Brotli/Gzip圧縮の有効化

## 🔄 CI/CD パイプライン

### GitHub Actions設定

```yaml
# Frontend デプロイ
- Next.jsアプリのビルド
- 型チェックとリント
- ユニットテスト実行
- Vercelへの自動デプロイ

# Backend デプロイ
- Honoアプリのビルド
- 型チェックとリント
- Cloudflare Workersへのデプロイ

# Storybook デプロイ
- Storybookのビルド
- Cloudflare Pagesへのデプロイ
```

## 📊 モニタリング

### 1. アプリケーション監視
- **Vercel Analytics**: フロントエンドのパフォーマンス監視
- **Cloudflare Analytics**: APIとCDNの利用状況
- **エラートラッキング**: Sentryによるエラー監視（オプション）

### 2. ログ管理
- **構造化ログ**: JSON形式でのログ出力
- **ログレベル**: 環境に応じたログレベルの調整
- **ログ保存**: Cloudflare Logsによる長期保存

## 🔮 今後の拡張性

### 1. 機能追加の容易性
- **プラグイン構造**: 新機能を独立したパッケージとして追加可能
- **API拡張**: RESTful設計により新エンドポイントの追加が容易
- **UI拡張**: コンポーネントベースで新画面の追加が簡単

### 2. スケーラビリティ
- **水平スケーリング**: Cloudflare Workersは自動的にスケール
- **データベース**: D1は自動的にレプリケーション
- **ストレージ**: R2は実質無制限のストレージ

### 3. 国際化対応
- **i18n準備**: Next.jsの国際化機能を活用可能
- **多言語コンテンツ**: Notionで多言語記事の管理が可能
- **地域最適化**: エッジコンピューティングで各地域に最適化

## 🤝 開発者向け情報

### ローカル開発のヒント
1. **Miniflare**: Cloudflare Workersのローカルエミュレータを使用
2. **SQLite**: D1と同じSQLiteでローカル開発
3. **Mock API**: 外部APIのモックを用意して開発効率化

### デバッグ方法
1. **Chrome DevTools**: Workersのデバッグが可能
2. **wrangler tail**: 本番環境のログをリアルタイムで確認
3. **Next.js DevTools**: React開発者ツールでコンポーネントデバッグ