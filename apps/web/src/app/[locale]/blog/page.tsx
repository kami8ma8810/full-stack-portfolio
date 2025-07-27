import { Metadata } from 'next';
import { BlogList } from '@/components/blog/blog-list';

export const metadata: Metadata = {
  title: 'Blog',
  description: 'Thoughts on web development, programming, and technology.',
};

export default function BlogPage() {
  return (
    <div className="container py-12">
      <div className="mx-auto max-w-4xl">
        <h1 className="mb-8 text-4xl font-bold tracking-tight">Blog</h1>
        <p className="mb-12 text-lg text-muted-foreground">
          Thoughts on web development, programming, and technology. I write about
          React, TypeScript, performance optimization, and building great user
          experiences.
        </p>
        <BlogList />
      </div>
    </div>
  );
}