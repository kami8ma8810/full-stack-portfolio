import { Suspense } from 'react';
import Link from 'next/link';
import { blogApiServer } from '@/lib/api/blog-server';
import { formatDate } from '@/lib/utils';
import { BlogPagination } from './blog-pagination';
import { BlogTags } from './blog-tags';

interface BlogListServerProps {
  searchParams?: {
    page?: string;
    tag?: string;
  };
}

// Server Component版のBlogList
export async function BlogListServer({ searchParams }: BlogListServerProps) {
  const page = Number(searchParams?.page) || 1;
  const tag = searchParams?.tag;

  try {
    const data = await blogApiServer.getList({
      page,
      limit: 10,
      tag,
    });

    const { posts, totalPages, tags } = data;

    return (
      <div>
        {tags && tags.length > 0 && (
          <Suspense fallback={<div className="mb-8 h-10 animate-pulse rounded bg-muted" />}>
            <BlogTags tags={tags} selectedTag={tag} />
          </Suspense>
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
                  {post.tags.map((postTag) => (
                    <span
                      key={postTag}
                      className="inline-flex items-center rounded-full bg-secondary px-2.5 py-0.5 text-xs font-medium text-secondary-foreground"
                    >
                      {postTag}
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
          <Suspense fallback={<div className="mt-12 h-10 animate-pulse rounded bg-muted" />}>
            <BlogPagination currentPage={page} totalPages={totalPages} />
          </Suspense>
        )}
      </div>
    );
  } catch (error) {
    throw new Error('Failed to load blog posts');
  }
}