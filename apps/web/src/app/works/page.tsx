import { Metadata } from 'next';
import { WorksList } from '@/components/works/works-list';

export const metadata: Metadata = {
  title: 'Works',
  description: 'A collection of projects I've worked on.',
};

export default function WorksPage() {
  return (
    <div className="container py-12">
      <div className="mx-auto max-w-6xl">
        <h1 className="mb-8 text-4xl font-bold tracking-tight">Works</h1>
        <p className="mb-12 text-lg text-muted-foreground">
          A collection of projects I've worked on. Each represents a unique
          challenge and learning opportunity.
        </p>
        <WorksList />
      </div>
    </div>
  );
}