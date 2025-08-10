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
            className={`brutalist-button px-4 py-2 typography-mono text-sm transition-all ${
              !selectedTag
                ? 'bg-primary text-primary-foreground'
                : 'bg-background hover-scale'
            }`}
          >
            ALL
          </button>
          {tags.map((tag) => (
            <button
              key={tag}
              onClick={() => setSelectedTag(tag)}
              className={`brutalist-button px-4 py-2 typography-mono text-sm transition-all ${
                selectedTag === tag
                  ? 'bg-primary text-primary-foreground'
                  : 'bg-background hover-scale'
              }`}
            >
              {tag.toUpperCase()}
            </button>
          ))}
        </div>
      )}

      <div className="space-y-8">
        {posts.map((post) => (
          <article key={post.id} className="group brutalist-border p-6 hover-lift transition-accessible">
            <time className="typography-mono text-xs text-primary">
              {formatDate(post.publishedAt)}
            </time>
            <h2 className="mb-2 mt-1 typography-headline text-2xl">
              <Link
                href={`/blog/${post.slug}`}
                className="hover:text-primary transition-colors"
              >
                {post.title}
              </Link>
            </h2>
            <p className="mb-4 typography-body text-muted-foreground">{post.excerpt}</p>
            <div className="flex items-center justify-between">
              <div className="flex flex-wrap gap-2">
                {post.tags.map((tag) => (
                  <span
                    key={tag}
                    className="color-block-primary px-3 py-1 typography-mono text-xs"
                  >
                    {tag}
                  </span>
                ))}
              </div>
              <span className="typography-mono text-sm text-muted-foreground">
                {post.readingTime} MIN READ
              </span>
            </div>
          </article>
        ))}
      </div>

      {totalPages > 1 && (
        <div className="mt-12 flex items-center justify-center gap-4">
          <button
            onClick={() => setPage(page - 1)}
            disabled={page === 1}
            className="brutalist-button px-4 py-2 typography-mono text-sm disabled:opacity-50 disabled:cursor-not-allowed hover-scale transition-accessible"
          >
            PREVIOUS
          </button>
          <span className="typography-mono text-sm text-muted-foreground">
            PAGE {page} / {totalPages}
          </span>
          <button
            onClick={() => setPage(page + 1)}
            disabled={page === totalPages}
            className="brutalist-button px-4 py-2 typography-mono text-sm disabled:opacity-50 disabled:cursor-not-allowed hover-scale transition-accessible"
          >
            NEXT
          </button>
        </div>
      )}
    </div>
  );
}