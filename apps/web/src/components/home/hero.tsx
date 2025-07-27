'use client';

import Link from 'next/link';
import { useState, useEffect } from 'react';

const roles = [
  'Frontend Engineer',
  'React Developer',
  'TypeScript Enthusiast',
  'UI/UX Designer',
  'Problem Solver',
];

export function Hero() {
  const [roleIndex, setRoleIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setRoleIndex((current) => (current + 1) % roles.length);
    }, 3000);

    return () => clearInterval(interval);
  }, []);

  return (
    <section className="relative overflow-hidden py-20 sm:py-32">
      <div className="container">
        <div className="mx-auto max-w-3xl text-center">
          <h1 className="mb-6 text-4xl font-bold tracking-tight sm:text-6xl">
            Hi, I'm Hiroki Kamiyama
          </h1>
          <div className="mb-8 h-8 text-xl text-muted-foreground sm:text-2xl">
            <span className="inline-block transition-opacity duration-500">
              {roles[roleIndex]}
            </span>
          </div>
          <p className="mb-10 text-lg leading-relaxed text-muted-foreground">
            I craft exceptional digital experiences with modern web technologies.
            Passionate about clean code, intuitive design, and pushing the boundaries
            of what's possible on the web.
          </p>
          <div className="flex flex-col gap-4 sm:flex-row sm:justify-center">
            <Link
              href="/works"
              className="inline-flex h-11 items-center justify-center rounded-md bg-primary px-8 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
            >
              View My Work
            </Link>
            <Link
              href="/contact"
              className="inline-flex h-11 items-center justify-center rounded-md border border-input bg-background px-8 text-sm font-medium transition-colors hover:bg-accent hover:text-accent-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
            >
              Get In Touch
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}