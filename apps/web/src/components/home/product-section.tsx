'use client';

import Link from 'next/link';
import Image from 'next/image';
import { useQuery } from '@tanstack/react-query';
import { ExternalLink, Github, Star, Rocket, Code, Zap } from 'lucide-react';
import { useTranslations } from 'next-intl';
import { worksApi } from '@/lib/api';
import { cn } from '@/lib/utils';

export function ProductSection() {
  const t = useTranslations('home');
  
  const { data, isLoading } = useQuery({
    queryKey: ['works', 'featured'],
    queryFn: worksApi.getList,
  });

  const stats = [
    { label: 'PROJECTS', value: '50+', icon: <Rocket size={24} /> },
    { label: 'TECHNOLOGIES', value: '15+', icon: <Code size={24} /> },
    { label: 'YEARS', value: '5+', icon: <Zap size={24} /> },
  ];

  // デフォルトのプロジェクトデータ（APIからのデータがない場合）
  const defaultProjects = [
    {
      id: 1,
      title: 'TASK MANAGEMENT APP',
      subtitle: 'Productivity Redefined',
      description: 'React + TypeScriptで構築されたモダンなタスク管理アプリケーション。ドラッグ&ドロップ機能とリアルタイム同期を搭載。',
      image: 'https://images.unsplash.com/photo-1611224923853-80b023f02d71?w=600&h=400&fit=crop',
      technologies: ['React', 'TypeScript', 'Node.js', 'MongoDB'],
      githubUrl: '#',
      liveUrl: '#',
      featured: true,
      category: 'WEB APP',
      year: '2024',
      number: '01',
    },
    {
      id: 2,
      title: 'E-COMMERCE PLATFORM',
      subtitle: 'Full-Stack Commerce',
      description: 'Next.jsとStripeを使用したフルスタックのEコマースサイト。管理者ダッシュボードと決済機能を含む。',
      image: 'https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?w=600&h=400&fit=crop',
      technologies: ['Next.js', 'Stripe', 'Prisma', 'PostgreSQL'],
      githubUrl: '#',
      liveUrl: '#',
      featured: true,
      category: 'E-COMMERCE',
      year: '2024',
      number: '02',
    },
    {
      id: 3,
      title: 'PORTFOLIO SITE',
      subtitle: 'Creative Showcase',
      description: 'レスポンシブデザインとスムーズなアニメーションを特徴とするポートフォリオサイト。',
      image: 'https://images.unsplash.com/photo-1467232004584-a241de8bcf5d?w=600&h=400&fit=crop',
      technologies: ['React', 'Tailwind CSS', 'Motion'],
      githubUrl: '#',
      liveUrl: '#',
      featured: false,
      category: 'PORTFOLIO',
      year: '2023',
      number: '03',
    },
  ];

  // APIデータがある場合は変換、ない場合はデフォルトデータを使用
  const projects = data?.length 
    ? data.slice(0, 4).map((work, index) => ({
        id: work.id,
        title: work.title.toUpperCase(),
        subtitle: work.description.slice(0, 50) + '...',
        description: work.description,
        image: work.thumbnail || `https://images.unsplash.com/photo-1611224923853-80b023f02d71?w=600&h=400&fit=crop`,
        technologies: work.technologies,
        githubUrl: work.githubUrl || '#',
        liveUrl: work.demoUrl || '#',
        featured: work.featured || index < 2,
        category: work.category || 'PROJECT',
        year: new Date().getFullYear().toString(),
        number: String(index + 1).padStart(2, '0'),
      }))
    : defaultProjects;

  if (isLoading) {
    return (
      <section 
        id="product" 
        className="py-32 bg-secondary/20 relative"
        aria-labelledby="product-heading"
        tabIndex={-1}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-center h-64">
            <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary"></div>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section 
      id="product" 
      className="py-32 bg-secondary/20 relative"
      aria-labelledby="product-heading"
      tabIndex={-1}
    >
      {/* セクション番号 */}
      <div className="absolute left-8 top-16 -rotate-90" aria-hidden="true">
        <span className="typography-mono text-xs text-muted-foreground">04 — WORK</span>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* 2025年トレンド: 非対称ヘッダー */}
        <div className="grid lg:grid-cols-3 gap-16 mb-20">
          <div className="lg:col-span-2">
            <h2 
              id="product-heading"
              className="typography-display text-5xl md:text-7xl mb-8"
            >
              SELECTED
              <br />
              <span className="text-primary">WORK</span>
            </h2>
            <div className="layered-composition">
              <div className="color-block-primary brutalist-border">
                <p className="typography-body text-lg">
                  Showcasing projects that demonstrate 
                  <span className="text-primary-foreground typography-mono"> technical expertise</span> and 
                  <span className="text-primary-foreground typography-mono"> creative problem-solving</span>
                </p>
              </div>
            </div>
          </div>
          
          {/* 統計セクション */}
          <div className="space-y-4">
            {stats.map((stat, index) => (
              <div 
                key={index}
                className="brutalist-border bg-background p-6 hover-lift transition-accessible flex items-center justify-between"
              >
                <div>
                  <div className="typography-display text-2xl text-primary">{stat.value}</div>
                  <div className="typography-mono text-xs text-muted-foreground">{stat.label}</div>
                </div>
                <div className="text-primary opacity-60">
                  {stat.icon}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* プロジェクトグリッド - 2025年トレンド */}
        <div className="grid md:grid-cols-2 gap-8 mb-16">
          {projects.map((project, index) => (
            <article 
              key={project.id} 
              className={cn(
                "group brutalist-border hover:shadow-2xl transition-accessible hover-tilt overflow-hidden bg-card",
                project.featured ? 'md:col-span-2' : ''
              )}
            >
              <div className={project.featured ? 'grid md:grid-cols-2 gap-0' : ''}>
                <div className="aspect-video overflow-hidden relative">
                  <Image
                    src={project.image}
                    alt={project.title}
                    width={600}
                    height={400}
                    className="w-full h-full object-cover group-hover:hover-scale transition-accessible"
                  />
                  {/* プロジェクト番号とカテゴリ */}
                  <div className="absolute top-4 left-4 space-y-2">
                    <div className="color-block-primary brutalist-border p-2">
                      <span className="typography-mono text-sm">{project.number}</span>
                    </div>
                    <div className="bg-background brutalist-border p-2">
                      <span className="typography-mono text-xs text-primary">{project.category}</span>
                    </div>
                  </div>
                  
                  {project.featured && (
                    <div className="absolute top-4 right-4">
                      <div className="color-block-secondary brutalist-border p-2 flex items-center">
                        <Star size={12} className="mr-1" />
                        <span className="typography-mono text-xs">FEATURED</span>
                      </div>
                    </div>
                  )}
                  
                  <div className="absolute bottom-4 right-4 bg-background brutalist-border p-2">
                    <span className="typography-mono text-xs text-muted-foreground">{project.year}</span>
                  </div>
                </div>
                
                <div className={cn(
                  "p-8 relative",
                  project.featured ? 'flex flex-col justify-center' : ''
                )}>
                  {/* 装飾的背景 */}
                  <div className="absolute top-0 right-0 w-12 h-12 bg-primary opacity-5 transform rotate-45" aria-hidden="true"></div>
                  
                  <div className="space-y-6">
                    <div>
                      <h3 className="typography-headline text-xl mb-2">{project.title}</h3>
                      <p className="typography-mono text-sm text-primary mb-4">{project.subtitle}</p>
                      <p className="typography-body text-muted-foreground">{project.description}</p>
                    </div>
                    
                    <div className="space-y-4">
                      <div className="flex flex-wrap gap-2">
                        {project.technologies.map((tech) => (
                          <span 
                            key={tech} 
                            className="brutalist-border bg-secondary text-foreground typography-mono text-xs px-2 py-1"
                          >
                            {tech}
                          </span>
                        ))}
                      </div>

                      <div className="flex gap-3">
                        <Link
                          href={project.githubUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="brutalist-button hover-scale typography-mono px-4 py-2 text-sm border border-border bg-background hover:bg-secondary transition-all inline-flex items-center"
                        >
                          <Github size={16} className="mr-2" />
                          CODE
                        </Link>
                        <Link
                          href={project.liveUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="brutalist-button bg-primary text-primary-foreground hover-lift typography-mono px-4 py-2 text-sm transition-all inline-flex items-center"
                        >
                          <ExternalLink size={16} className="mr-2" />
                          LIVE DEMO
                        </Link>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </article>
          ))}
        </div>

        {/* 2025年トレンド: ブルータリズム風CTAセクション */}
        <div className="layered-composition text-center">
          <div className="color-block-secondary brutalist-border p-12">
            <h3 className="typography-headline text-3xl mb-4">INTERESTED IN COLLABORATION?</h3>
            <p className="typography-body mb-8 max-w-2xl mx-auto">
              一緒に革新的なプロジェクトを作り上げませんか。
              技術的な課題から創造的なソリューションまで、お気軽にご相談ください。
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                href="/works"
                className="brutalist-button bg-primary text-primary-foreground hover-lift typography-mono px-8 py-4 text-lg transition-all inline-flex items-center justify-center"
              >
                VIEW ALL PROJECTS
                <ExternalLink className="ml-2" size={20} />
              </Link>
              <Link
                href="/contact"
                className="brutalist-button hover-scale typography-mono px-8 py-4 text-lg border border-border bg-background hover:bg-secondary transition-all inline-flex items-center justify-center"
              >
                START A PROJECT
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* 装飾的要素 */}
      <div className="absolute right-0 top-0 bottom-0 w-px bg-border" aria-hidden="true"></div>
      <div className="absolute left-1/3 bottom-32 w-2 h-24 bg-accent opacity-20" aria-hidden="true"></div>
    </section>
  );
}