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

  if (isError || !data) {
    return (
      <div className="text-center text-muted-foreground">
        Failed to load works. Please try again later.
      </div>
    );
  }

  return (
    <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
      {data.map((work) => (
        <article
          key={work.id}
          className="group overflow-hidden rounded-lg border bg-card transition-colors hover:bg-accent"
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
              <h3 className="mb-2 text-lg font-semibold group-hover:underline">
                {work.title}
              </h3>
              <p className="mb-4 line-clamp-2 text-sm text-muted-foreground">
                {work.description}
              </p>
              <div className="flex flex-wrap gap-2">
                {work.technologies.slice(0, 3).map((tech) => (
                  <span
                    key={tech}
                    className="inline-flex items-center rounded-md bg-secondary px-2 py-1 text-xs font-medium text-secondary-foreground"
                  >
                    {tech}
                  </span>
                ))}
                {work.technologies.length > 3 && (
                  <span className="inline-flex items-center px-2 py-1 text-xs text-muted-foreground">
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