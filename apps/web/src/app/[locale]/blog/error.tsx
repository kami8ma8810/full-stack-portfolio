'use client';

export default function BlogError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <div className="container py-12">
      <div className="mx-auto max-w-4xl text-center">
        <h2 className="mb-4 text-2xl font-semibold">Failed to load blog posts</h2>
        <p className="mb-6 text-muted-foreground">
          {error.message || 'Something went wrong while loading the blog posts.'}
        </p>
        <button
          onClick={reset}
          className="inline-flex h-10 items-center justify-center rounded-md bg-primary px-4 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90"
        >
          Try again
        </button>
      </div>
    </div>
  );
}