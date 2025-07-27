'use client';

import Link from 'next/link';
import Image from 'next/image';
import { useQuery } from '@tanstack/react-query';
import { worksApi } from '@/lib/api';

export function FeaturedWorks() {
  const { data, isLoading } = useQuery({
    queryKey: ['works', 'featured'],
    queryFn: worksApi.getList,
  });

  if (isLoading || !data?.length) {
    return null;
  }

  const featuredWorks = data.filter((work) => work.featured).slice(0, 3);

  if (!featuredWorks.length) {
    return null;
  }

  return (
    <section className="bg-muted/50 py-16 sm:py-24">
      <div className="container">
        <div className="mb-12 flex items-center justify-between">
          <h2 className="text-3xl font-bold tracking-tight">Featured Works</h2>
          <Link
            href="/works"
            className="text-sm font-medium text-muted-foreground hover:text-foreground"
          >
            View all works →
          </Link>
        </div>

        <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
          {featuredWorks.map((work) => (
            <article
              key={work.id}
              className="group relative overflow-hidden rounded-lg border bg-card"
            >
              <Link href={`/works/${work.id}`} className="block">
                <div className="aspect-video overflow-hidden bg-muted">
                  {work.thumbnail && (
                    <Image
                      src={work.thumbnail}
                      alt={work.title}
                      width={400}
                      height={225}
                      className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
                    />
                  )}
                </div>
                <div className="p-6">
                  <h3 className="mb-2 text-lg font-semibold">
                    <span className="group-hover:underline">{work.title}</span>
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
                  </div>
                </div>
              </Link>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}