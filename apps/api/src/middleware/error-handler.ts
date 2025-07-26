/**
 * エラーハンドリングミドルウェア
 * 
 * APIで発生したエラーを統一的に処理し、
 * クライアントに適切なエラーレスポンスを返します。
 */

import { Context } from 'hono';
import { HTTPException } from 'hono/http-exception';
import { ZodError } from 'zod';

/**
 * エラーレスポンスの型定義
 */
interface ErrorResponse {
  error: string;
  message: string;
  details?: unknown;
  timestamp: string;
  path: string;
}

/**
 * エラーハンドラー関数
 * 
 * @param err - 発生したエラー
 * @param c - Honoのコンテキスト
 * @returns エラーレスポンス
 */
export async function errorHandler(err: Error, c: Context) {
  console.error('Error occurred:', {
    error: err.message,
    stack: err.stack,
    path: c.req.path,
    method: c.req.method,
  });

  const timestamp = new Date().toISOString();
  const path = c.req.path;

  // HTTPExceptionの場合（Honoの標準的なHTTPエラー）
  if (err instanceof HTTPException) {
    const response = err.getResponse();
    return c.json<ErrorResponse>(
      {
        error: response.statusText || 'HTTP Error',
        message: err.message,
        timestamp,
        path,
      },
      response.status as any,
    );
  }

  // Zodバリデーションエラーの場合
  if (err instanceof ZodError) {
    return c.json<ErrorResponse>(
      {
        error: 'Validation Error',
        message: 'The request data is invalid',
        details: err.errors.map((e) => ({
          field: e.path.join('.'),
          message: e.message,
        })),
        timestamp,
        path,
      },
      400,
    );
  }

  // Notion APIエラーの場合
  if (err.name === 'APIResponseError' && err.message.includes('notion')) {
    return c.json<ErrorResponse>(
      {
        error: 'External API Error',
        message: 'Failed to fetch data from Notion',
        timestamp,
        path,
      },
      503, // Service Unavailable
    );
  }

  // その他の予期しないエラー
  return c.json<ErrorResponse>(
    {
      error: 'Internal Server Error',
      message: c.env.ENVIRONMENT === 'development' 
        ? err.message 
        : 'An unexpected error occurred',
      timestamp,
      path,
    },
    500,
  );
}