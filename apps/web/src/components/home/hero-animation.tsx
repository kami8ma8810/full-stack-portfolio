'use client';

import { useState, useEffect } from 'react';

const roles = [
  'Frontend Engineer',
  'React Developer',
  'TypeScript Enthusiast',
  'UI/UX Designer',
  'Problem Solver',
];

// アニメーション部分のみをClient Componentとして分離
export function HeroAnimation() {
  const [roleIndex, setRoleIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setRoleIndex((current) => (current + 1) % roles.length);
    }, 3000);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="mb-8 h-8 text-xl text-muted-foreground sm:text-2xl">
      <span className="inline-block transition-opacity duration-500">
        {roles[roleIndex]}
      </span>
    </div>
  );
}