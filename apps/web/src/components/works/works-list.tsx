'use client';

import Link from 'next/link';
import Image from 'next/image';
import { useQuery } from '@tanstack/react-query';
import { worksApi } from '@/lib/api';

export function WorksList() {
  const { data, isLoading, isError } = useQuery({
    queryKey: ['works'],
    queryFn: worksApi.getList,
  });

  if (isLoading) {
    return (
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {[...Array(6)].map((_, i) => (
          <div key={i} className="animate-pulse">
            <div className="aspect-video rounded-lg bg-muted"></div>
            <div className="mt-4 h-6 w-3/4 rounded bg-muted"></div>
            <div className="mt-2 h-16 rounded bg-muted"></div>
          </div>
        ))}
      </div>
    );
  }

  if (isError) {
    return (
      <div className="text-center text-muted-foreground">
        Failed to load works. Please try again later.
      </div>
    );
  }

  if (!data || data.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-muted-foreground mb-4">No works available yet.</p>
        <p className="text-sm text-muted-foreground">Check back later for updates!</p>
      </div>
    );
  }

  return (
    <div className="asymmetric-cards">
      {data.map((work) => (
        <article
          key={work.id}
          className="group brutalist-border bg-card hover-lift transition-accessible overflow-hidden"
        >
          <Link href={`/works/${work.id}`}>
            <div className="aspect-video overflow-hidden bg-muted">
              {work.thumbnail && (
                <Image
                  src={work.thumbnail}
                  alt={work.title}
                  width={600}
                  height={338}
                  className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
                />
              )}
            </div>
            <div className="p-6">
              <h3 className="mb-2 typography-headline text-lg group-hover:text-primary transition-colors">
                {work.title}
              </h3>
              <p className="mb-4 line-clamp-2 text-sm text-muted-foreground typography-body">
                {work.description}
              </p>
              <div className="flex flex-wrap gap-2">
                {work.technologies.slice(0, 3).map((tech) => (
                  <span
                    key={tech}
                    className="color-block-primary px-3 py-1 typography-mono text-xs"
                  >
                    {tech}
                  </span>
                ))}
                {work.technologies.length > 3 && (
                  <span className="inline-flex items-center px-2 py-1 typography-mono text-xs text-muted-foreground">
                    +{work.technologies.length - 3} more
                  </span>
                )}
              </div>
            </div>
          </Link>
        </article>
      ))}
    </div>
  );
}