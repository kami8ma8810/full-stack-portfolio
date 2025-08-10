'use client';

import Link from 'next/link';
import { useQuery } from '@tanstack/react-query';
import { Calendar, ArrowRight, BookOpen } from 'lucide-react';
import { useTranslations } from 'next-intl';
import { blogApi } from '@/lib/api';
import { formatDate } from '@/lib/utils';

export function BlogSection() {
  const t = useTranslations('home');
  
  const { data, isLoading } = useQuery({
    queryKey: ['blog', 'recent'],
    queryFn: () => blogApi.getList({ limit: 3 }),
  });

  // デフォルトのブログデータ（APIからのデータがない場合）
  const defaultPosts = [
    {
      id: 1,
      title: 'REACT STATE MANAGEMENT',
      subtitle: 'モダンな状態管理手法',
      excerpt: 'ReactでのZustandとReact QueryTanStack Queryを使った効率的な状態管理手法について解説します。',
      date: '2025.01.15',
      image: 'https://images.unsplash.com/photo-1633356122544-f134324a6cee?w=400&h=250&fit=crop',
      tags: ['React', 'State Management'],
      number: '01',
      slug: 'react-state-management',
    },
    {
      id: 2,
      title: 'TYPESCRIPT BEST PRACTICES',
      subtitle: '型安全性の追求',
      excerpt: '型安全性を保ちながら保守性の高いコードを書くためのTypeScriptのベストプラクティスをご紹介します。',
      date: '2025.01.10',
      image: 'https://images.unsplash.com/photo-1516116216624-53e697fedbea?w=400&h=250&fit=crop',
      tags: ['TypeScript', 'Development'],
      number: '02',
      slug: 'typescript-best-practices',
    },
    {
      id: 3,
      title: 'UI/UX DESIGN PRINCIPLES',
      subtitle: 'デザインの基本原則',
      excerpt: 'ユーザー中心のデザインを実現するための基本的な原則と実践的なテクニックについて説明します。',
      date: '2025.01.05',
      image: 'https://images.unsplash.com/photo-1561070791-2526d30994b5?w=400&h=250&fit=crop',
      tags: ['Design', 'UX'],
      number: '03',
      slug: 'ui-ux-design-principles',
    },
  ];

  // APIデータがある場合は変換、ない場合はデフォルトデータを使用
  const blogPosts = data?.posts?.length 
    ? data.posts.slice(0, 3).map((post, index) => ({
        id: post.id,
        title: post.title.toUpperCase(),
        subtitle: post.excerpt?.slice(0, 30) + '...' || 'Latest Article',
        excerpt: post.excerpt || post.title,
        date: formatDate(post.publishedAt, 'YYYY.MM.DD'),
        image: `https://images.unsplash.com/photo-1633356122544-f134324a6cee?w=400&h=250&fit=crop`,
        tags: post.tags,
        number: String(index + 1).padStart(2, '0'),
        slug: post.slug,
      }))
    : defaultPosts;

  if (isLoading) {
    return (
      <section 
        id="blog" 
        className="py-32 bg-secondary/20 relative"
        aria-labelledby="blog-heading"
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
      id="blog" 
      className="py-32 bg-secondary/20 relative"
      aria-labelledby="blog-heading"
      tabIndex={-1}
    >
      {/* セクション番号 */}
      <div className="absolute left-8 top-16 -rotate-90" aria-hidden="true">
        <span className="typography-mono text-xs text-muted-foreground">03 — BLOG</span>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* ヘッダー */}
        <div className="asymmetric-grid mb-20">
          <div className="flex items-center">
            <div className="w-12 h-12 bg-primary brutalist-border flex items-center justify-center">
              <BookOpen className="text-primary-foreground" size={24} />
            </div>
          </div>
          <div>
            <h2 
              id="blog-heading"
              className="typography-display text-5xl md:text-7xl mb-8"
            >
              BLOG
            </h2>
            <div className="color-block-primary brutalist-border">
              <p className="typography-body text-lg">
                Technical insights, design ideas, and development experiences 
                <span className="text-primary-foreground typography-mono"> shared for the community</span>
              </p>
            </div>
          </div>
          <div className="hidden lg:block">
            <div className="color-block-secondary brutalist-border text-center p-8">
              <div className="typography-display text-4xl">15+</div>
              <div className="typography-mono text-xs opacity-70">ARTICLES</div>
            </div>
          </div>
        </div>

        {/* ブログカード */}
        <div className="asymmetric-cards mb-16">
          {blogPosts.map((post, index) => (
            <article 
              key={post.id} 
              className="brutalist-border hover:shadow-2xl transition-accessible hover-lift group overflow-hidden bg-card"
            >
              <Link href={`/blog/${post.slug}`} className="block">
                <div className="aspect-video overflow-hidden relative">
                  <img
                    src={post.image}
                    alt={post.title}
                    className="w-full h-full object-cover group-hover:hover-scale transition-accessible"
                  />
                  <div className="absolute top-4 left-4 color-block-primary brutalist-border p-2">
                    <span className="typography-mono text-sm">{post.number}</span>
                  </div>
                  <div className="absolute top-4 right-4 bg-background brutalist-border p-2">
                    <ArrowRight 
                      size={16} 
                      className="text-primary opacity-0 group-hover:opacity-100 transition-accessible" 
                    />
                  </div>
                </div>
                
                <div className="p-8 relative">
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <span className="typography-mono text-xs text-muted-foreground flex items-center">
                        <Calendar size={12} className="mr-2" />
                        {post.date}
                      </span>
                      <div className="flex gap-2">
                        {post.tags.slice(0, 2).map((tag) => (
                          <span
                            key={tag}
                            className="px-2 py-1 bg-secondary text-foreground typography-mono text-xs brutalist-border"
                          >
                            {tag}
                          </span>
                        ))}
                      </div>
                    </div>
                    
                    <div>
                      <h3 className="typography-headline text-xl mb-2">{post.title}</h3>
                      <p className="typography-mono text-sm text-primary mb-3">{post.subtitle}</p>
                      <p className="typography-body text-muted-foreground line-clamp-3">{post.excerpt}</p>
                    </div>

                    <div className="brutalist-button bg-secondary hover:bg-primary hover:text-primary-foreground p-3 group w-full justify-between flex items-center transition-all">
                      <span className="typography-mono">READ MORE</span>
                      <ArrowRight 
                        size={16} 
                        className="group-hover:translate-x-1 transition-accessible" 
                      />
                    </div>
                  </div>
                </div>
              </Link>
            </article>
          ))}
        </div>

        {/* CTA */}
        <div className="layered-composition text-center">
          <div className="color-block-secondary brutalist-border p-12">
            <h3 className="typography-headline text-2xl mb-4">WANT MORE CONTENT?</h3>
            <p className="typography-body mb-8 max-w-2xl mx-auto">
              技術的な深い洞察とクリエイティブなアイデアを定期的に共有しています。
              すべての記事をチェックして、あなたの開発力を向上させましょう。
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                href="/blog"
                className="brutalist-button bg-primary text-primary-foreground hover-lift typography-mono px-8 py-4 text-lg transition-all inline-flex items-center justify-center"
              >
                ALL ARTICLES
                <ArrowRight className="ml-2" size={20} />
              </Link>
              <Link
                href="/blog"
                className="brutalist-button hover-scale typography-mono px-8 py-4 text-lg border border-border bg-background hover:bg-secondary transition-all inline-flex items-center justify-center"
              >
                SUBSCRIBE
              </Link>
            </div>
          </div>
        </div>
      </div>

      <div className="absolute right-0 top-0 bottom-0 w-px bg-border" aria-hidden="true"></div>
    </section>
  );
}