'use client';

import { useQuery } from '@tanstack/react-query';
import { statsApi } from '@/lib/api';

export function Stats() {
  const { data, isLoading } = useQuery({
    queryKey: ['stats', 'summary'],
    queryFn: statsApi.getSummary,
  });

  if (isLoading || !data) {
    return null;
  }

  const stats = [
    {
      label: 'GitHub Contributions',
      value: data.github.contributions.toLocaleString(),
      unit: 'this year',
    },
    {
      label: 'Total Stars',
      value: data.github.stars.toLocaleString(),
      unit: 'on GitHub',
    },
    {
      label: 'Weekly Coding',
      value: data.wakatime?.weeklyHours.toFixed(1) || '0',
      unit: 'hours',
    },
    {
      label: 'Top Language',
      value: data.github.topLanguage,
      unit: 'most used',
    },
  ];

  return (
    <section className="py-16 sm:py-24">
      <div className="container">
        <h2 className="mb-12 text-center text-3xl font-bold tracking-tight">
          By the Numbers
        </h2>
        <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
          {stats.map((stat) => (
            <div key={stat.label} className="text-center">
              <div className="mb-2 text-4xl font-bold text-primary">
                {stat.value}
              </div>
              <div className="text-sm font-medium">{stat.label}</div>
              <div className="text-xs text-muted-foreground">{stat.unit}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}