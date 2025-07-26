/**
 * CSP違反レポート処理
 * 
 * Content Security Policyの違反レポートを受け取り、
 * ログに記録するエンドポイントです。
 */

import { Hono } from 'hono';
import type { Bindings } from '../types/bindings';

const cspReportRoutes = new Hono<{ Bindings: Bindings }>();

/**
 * CSP違反レポートの型定義
 */
interface CSPReport {
  'csp-report': {
    'document-uri': string;
    'violated-directive': string;
    'effective-directive': string;
    'original-policy': string;
    'disposition': string;
    'blocked-uri': string;
    'line-number'?: number;
    'column-number'?: number;
    'source-file'?: string;
    'status-code': number;
    'script-sample'?: string;
  };
}

/**
 * POST /api/csp-report
 * CSP違反レポートを受信
 */
cspReportRoutes.post('/', async (c) => {
  try {
    const report = await c.req.json<CSPReport>();
    
    // 開発環境では詳細をログ出力
    if (c.env.ENVIRONMENT === 'development') {
      console.log('CSP Violation Report:', JSON.stringify(report, null, 2));
    } else {
      // 本番環境では重要な情報のみログ
      const violation = report['csp-report'];
      console.warn('CSP Violation:', {
        documentUri: violation['document-uri'],
        violatedDirective: violation['violated-directive'],
        blockedUri: violation['blocked-uri'],
        sourceFile: violation['source-file'],
        lineNumber: violation['line-number'],
      });
    }
    
    // TODO: 本番環境では、重要な違反を通知したり、
    // データベースに保存して分析することを検討
    
    // レポートを受け取ったことを通知
    return c.text('OK', 204);
  } catch (error) {
    console.error('Failed to process CSP report:', error);
    // CSPレポートの処理に失敗しても200を返す
    // （ブラウザがリトライし続けるのを防ぐため）
    return c.text('OK', 204);
  }
});

export { cspReportRoutes };