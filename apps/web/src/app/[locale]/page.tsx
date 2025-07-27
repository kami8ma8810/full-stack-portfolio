import Link from 'next/link';
import { Hero } from '@/components/home/hero';
import { RecentPosts } from '@/components/home/recent-posts';
import { FeaturedWorks } from '@/components/home/featured-works';
import { Stats } from '@/components/home/stats';

export default function HomePage() {
  return (
    <>
      <Hero />
      <RecentPosts />
      <FeaturedWorks />
      <Stats />
    </>
  );
}