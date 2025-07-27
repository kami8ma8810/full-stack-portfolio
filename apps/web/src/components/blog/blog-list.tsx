'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useQuery } from '@tanstack/react-query';
import { blogApi } from '@/lib/api';
import { formatDate } from '@/lib/utils';

const POSTS_PER_PAGE = 10;

export function BlogList() {
  const [page, setPage] = useState(1);
  const [selectedTag, setSelectedTag] = useState<string | undefined>();

  const { data, isLoading, isError } = useQuery({
    queryKey: ['blog', page, selectedTag],
    queryFn: () =>
      blogApi.getList({
        page,
        limit: POSTS_PER_PAGE,
        tag: selectedTag,
      }),
  });

  if (isLoading) {
    return (
      <div className="space-y-8">
        {[...Array(3)].map((_, i) => (
          <div key={i} className="animate-pulse">
            <div className="mb-2 h-4 w-32 rounded bg-muted"></div>
            <div className="mb-2 h-6 w-3/4 rounded bg-muted"></div>
            <div className="h-20 rounded bg-muted"></div>
          </div>
        ))}
      </div>
    );
  }

  if (isError || !data) {
    return (
      <div className="text-center text-muted-foreground">
        Failed to load posts. Please try again later.
      </div>
    );
  }

  const { posts, totalPages, tags } = data;

  return (
    <div>
      {tags && tags.length > 0 && (
        <div className="mb-8 flex flex-wrap gap-2">
          <button
            onClick={() => setSelectedTag(undefined)}
            className={`rounded-full px-3 py-1 text-sm font-medium transition-colors ${
              !selectedTag
                ? 'bg-primary text-primary-foreground'
                : 'bg-secondary text-secondary-foreground hover:bg-secondary/80'
            }`}
          >
            All
          </button>
          {tags.map((tag) => (
            <button
              key={tag}
              onClick={() => setSelectedTag(tag)}
              className={`rounded-full px-3 py-1 text-sm font-medium transition-colors ${
                selectedTag === tag
                  ? 'bg-primary text-primary-foreground'
                  : 'bg-secondary text-secondary-foreground hover:bg-secondary/80'
              }`}
            >
              {tag}
            </button>
          ))}
        </div>
      )}

      <div className="space-y-8">
        {posts.map((post) => (
          <article key={post.id} className="group">
            <time className="text-sm text-muted-foreground">
              {formatDate(post.publishedAt)}
            </time>
            <h2 className="mb-2 mt-1 text-2xl font-semibold">
              <Link
                href={`/blog/${post.slug}`}
                className="hover:underline"
              >
                {post.title}
              </Link>
            </h2>
            <p className="mb-4 text-muted-foreground">{post.excerpt}</p>
            <div className="flex items-center justify-between">
              <div className="flex flex-wrap gap-2">
                {post.tags.map((tag) => (
                  <span
                    key={tag}
                    className="inline-flex items-center rounded-full bg-secondary px-2.5 py-0.5 text-xs font-medium text-secondary-foreground"
                  >
                    {tag}
                  </span>
                ))}
              </div>
              <span className="text-sm text-muted-foreground">
                {post.readingTime} min read
              </span>
            </div>
          </article>
        ))}
      </div>

      {totalPages > 1 && (
        <div className="mt-12 flex items-center justify-center gap-2">
          <button
            onClick={() => setPage(page - 1)}
            disabled={page === 1}
            className="rounded-md px-3 py-1 text-sm font-medium transition-colors hover:bg-secondary disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Previous
          </button>
          <span className="text-sm text-muted-foreground">
            Page {page} of {totalPages}
          </span>
          <button
            onClick={() => setPage(page + 1)}
            disabled={page === totalPages}
            className="rounded-md px-3 py-1 text-sm font-medium transition-colors hover:bg-secondary disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Next
          </button>
        </div>
      )}
    </div>
  );
}