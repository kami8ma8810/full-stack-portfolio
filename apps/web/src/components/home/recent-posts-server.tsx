import Link from 'next/link';
import { blogApi } from '@/lib/api';
import { formatDate } from '@/lib/utils';

// Server Component版のRecentPosts
export async function RecentPostsServer() {
  try {
    const response = await blogApi.getList({ limit: 3 });
    
    if ('error' in response || !response.data?.posts.length) {
      return null;
    }

    const { posts } = response.data;

    return (
      <section className="py-16 sm:py-24">
        <div className="container">
          <div className="mb-12 flex items-center justify-between">
            <h2 className="text-3xl font-bold tracking-tight">Recent Posts</h2>
            <Link
              href="/blog"
              className="text-sm font-medium text-muted-foreground hover:text-foreground"
            >
              View all posts →
            </Link>
          </div>

          <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
            {posts.map((post) => (
              <article
                key={post.id}
                className="group relative flex flex-col space-y-2"
              >
                <time className="text-sm text-muted-foreground">
                  {formatDate(post.publishedAt)}
                </time>
                <h3 className="text-xl font-semibold">
                  <Link
                    href={`/blog/${post.slug}`}
                    className="after:absolute after:inset-0"
                  >
                    <span className="group-hover:underline">{post.title}</span>
                  </Link>
                </h3>
                <p className="line-clamp-3 text-muted-foreground">{post.excerpt}</p>
                <div className="flex flex-wrap gap-2 pt-2">
                  {post.tags.map((tag) => (
                    <span
                      key={tag}
                      className="inline-flex items-center rounded-full bg-secondary px-2.5 py-0.5 text-xs font-medium text-secondary-foreground"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>
    );
  } catch (error) {
    console.error('Failed to fetch recent posts:', error);
    return null;
  }
}