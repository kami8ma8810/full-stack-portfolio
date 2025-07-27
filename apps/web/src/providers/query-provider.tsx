'use client';

import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import { useState } from 'react';

export function QueryProvider({ children }: { children: React.ReactNode }) {
  const [queryClient] = useState(
    () =>
      new QueryClient({
        defaultOptions: {
          queries: {
            // データの再取得間隔
            staleTime: 60 * 1000, // 1分
            // キャッシュの保持時間
            gcTime: 5 * 60 * 1000, // 5分（旧cacheTime）
            // リトライ設定
            retry: 1,
            // エラー時のリトライ遅延
            retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000),
            // ウィンドウフォーカス時の再取得を無効化
            refetchOnWindowFocus: false,
          },
        },
      }),
  );

  return (
    <QueryClientProvider client={queryClient}>
      {children}
      {/* 開発環境でのみReactQueryDevtoolsを表示 */}
      <ReactQueryDevtools initialIsOpen={false} />
    </QueryClientProvider>
  );
}