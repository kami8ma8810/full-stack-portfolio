import { Suspense } from 'react';
import { HeroServer } from '@/components/home/hero-server';
import { RecentPostsServer } from '@/components/home/recent-posts-server';
import { FeaturedWorksServer } from '@/components/home/featured-works-server';
import { StatsServer } from '@/components/home/stats-server';
import { RecentPostsSkeleton } from '@/components/home/recent-posts-skeleton';
import { FeaturedWorksSkeleton } from '@/components/home/featured-works-skeleton';
import { StatsSkeleton } from '@/components/home/stats-skeleton';

// Server Component として最適化されたホームページ
export default function HomePageOptimized() {
  return (
    <>
      {/* Hero はインタラクティブな部分が少ないので即座にレンダリング */}
      <HeroServer />
      
      {/* 各セクションは独立してストリーミング */}
      <Suspense fallback={<RecentPostsSkeleton />}>
        <RecentPostsServer />
      </Suspense>
      
      <Suspense fallback={<FeaturedWorksSkeleton />}>
        <FeaturedWorksServer />
      </Suspense>
      
      <Suspense fallback={<StatsSkeleton />}>
        <StatsServer />
      </Suspense>
    </>
  );
}