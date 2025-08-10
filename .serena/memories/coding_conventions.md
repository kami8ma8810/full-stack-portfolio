# コーディング規約とスタイルガイド

## TypeScript規約
- **any型の使用禁止**: 型安全性確保のため`any`型は使用しない
- 代替案: `unknown`, `Record<string, unknown>`, ジェネリクス, Union型
- 既存ライブラリで必要な場合はコメントで理由を説明
- 段階的型付けで一時的に使用する場合はTODOコメントと期限を記載

## ファイル・ディレクトリ命名規則
- **コンポーネント**: PascalCase（例: `HeroSection.tsx`）
- **ファイル名**: kebab-case（例: `hero-section.tsx`）
- **ディレクトリ**: kebab-case
- **型定義**: 明確な型名を使用

## スタイリング規約
- **Tailwind CSS**: ユーティリティファーストアプローチ
- **カスタムクラス**: 2025年トレンドを意識
  - `.brutalist-border` - ブルータリズム風境界線
  - `.brutalist-button` - 3Dエフェクトボタン
  - `.typography-display` - 大胆なタイポグラフィ
  - `.hover-glow` - ホバーエフェクト

## アクセシビリティ
- **WCAG 2.2準拠**: フォーカス管理、コントラスト、モーション制御
- **スキップリンク**: `.skip-link` クラス実装
- **スクリーンリーダー**: `.sr-only` クラス使用
- **セマンティックHTML**: 適切なHTML要素の使用

## 国際化（i18n）
- **next-intl**: 多言語対応ライブラリ使用
- **対応言語**: 日本語（デフォルト）、英語
- **ファイル構成**: `/messages/ja.json`, `/messages/en.json`