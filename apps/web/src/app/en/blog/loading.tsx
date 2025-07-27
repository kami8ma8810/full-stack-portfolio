export default function BlogLoading() {
  return (
    <div className="container py-12">
      <div className="mx-auto max-w-4xl">
        <div className="mb-8 h-10 w-32 animate-pulse rounded bg-muted" />
        <div className="mb-12 space-y-2">
          <div className="h-6 w-full animate-pulse rounded bg-muted" />
          <div className="h-6 w-3/4 animate-pulse rounded bg-muted" />
        </div>
        
        <div className="space-y-8">
          {[...Array(5)].map((_, i) => (
            <div key={i} className="animate-pulse">
              <div className="mb-2 h-4 w-32 rounded bg-muted" />
              <div className="mb-2 h-6 w-3/4 rounded bg-muted" />
              <div className="mb-4 h-20 rounded bg-muted" />
              <div className="flex gap-2">
                <div className="h-6 w-16 rounded-full bg-muted" />
                <div className="h-6 w-20 rounded-full bg-muted" />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}