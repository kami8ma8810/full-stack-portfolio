# タスク完了時の実行項目

## 実装後の確認事項

### 1. コード品質チェック
```bash
# TypeScript型チェック
pnpm type-check

# ESLintでコード品質をチェック
pnpm lint

# Prettierでフォーマット確認
pnpm format:check
```

### 2. 動作確認
```bash
# 開発サーバーで動作確認
pnpm dev

# ビルドが成功することを確認
pnpm build
```

### 3. テスト実行
```bash
# E2Eテストでユーザーフローを検証
pnpm test:e2e

# テスト検証
pnpm test:verify
```

### 4. アクセシビリティ確認
- WCAG 2.2 AAレベル準拠
- キーボードナビゲーション動作確認
- スクリーンリーダー対応確認
- フォーカス管理の確認

### 5. ブラウザ対応確認
- Chrome, Firefox, Safari, Edgeでの動作確認
- モバイルデバイスでのレスポンシブ確認

### 6. パフォーマンス確認
- Lighthouse スコア確認
- Core Web Vitals 測定
- 画像最適化確認

## エラー対応

### よくあるエラー
1. **型エラー**: `any`型の使用禁止ルールに従い、適切な型を定義
2. **import エラー**: パス解決の確認、相対パスと絶対パスの適切な使用
3. **多言語対応エラー**: メッセージキーの存在確認、翻訳ファイルの更新

### デバッグコマンド
```bash
# 開発サーバーログの確認
pnpm dev --verbose

# ビルドエラーの詳細確認
pnpm build --debug
```