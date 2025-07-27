import { Metadata } from 'next';
import { Suspense } from 'react';
import { BlogListServer } from '@/components/blog/blog-list-server';
import BlogLoading from './loading';

export const metadata: Metadata = {
  title: 'Blog',
  description: 'Thoughts on web development, programming, and technology.',
};

interface BlogPageProps {
  searchParams?: {
    page?: string;
    tag?: string;
  };
}

// Server Component として最適化されたBlogページ
export default function BlogPageOptimized({ searchParams }: BlogPageProps) {
  return (
    <div className="container py-12">
      <div className="mx-auto max-w-4xl">
        <h1 className="mb-8 text-4xl font-bold tracking-tight">Blog</h1>
        <p className="mb-12 text-lg text-muted-foreground">
          Thoughts on web development, programming, and technology. I write about
          React, TypeScript, performance optimization, and building great user
          experiences.
        </p>
        
        {/* BlogListをSuspenseでラップしてストリーミング */}
        <Suspense 
          key={`${searchParams?.page}-${searchParams?.tag}`} 
          fallback={<BlogLoading />}
        >
          <BlogListServer searchParams={searchParams} />
        </Suspense>
      </div>
    </div>
  );
}