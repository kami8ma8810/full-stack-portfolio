'use client';

import { useRouter, useSearchParams } from 'next/navigation';

interface BlogPaginationProps {
  currentPage: number;
  totalPages: number;
}

// ページネーション部分のみClient Component
export function BlogPagination({ currentPage, totalPages }: BlogPaginationProps) {
  const router = useRouter();
  const searchParams = useSearchParams();

  const handlePageChange = (page: number) => {
    const params = new URLSearchParams(searchParams.toString());
    params.set('page', page.toString());
    router.push(`/blog?${params.toString()}`);
  };

  return (
    <div className="mt-12 flex items-center justify-center gap-2">
      <button
        onClick={() => handlePageChange(currentPage - 1)}
        disabled={currentPage === 1}
        className="rounded-md px-3 py-1 text-sm font-medium transition-colors hover:bg-secondary disabled:opacity-50 disabled:cursor-not-allowed"
      >
        Previous
      </button>
      <span className="text-sm text-muted-foreground">
        Page {currentPage} of {totalPages}
      </span>
      <button
        onClick={() => handlePageChange(currentPage + 1)}
        disabled={currentPage === totalPages}
        className="rounded-md px-3 py-1 text-sm font-medium transition-colors hover:bg-secondary disabled:opacity-50 disabled:cursor-not-allowed"
      >
        Next
      </button>
    </div>
  );
}