'use client';

import Link from 'next/link';
import { useTranslations, useLocale } from 'next-intl';

export function Hero() {
  const t = useTranslations('hero');
  const tCommon = useTranslations('common');
  const locale = useLocale();

  return (
    <section 
      id="hero"
      className="relative overflow-hidden py-20 sm:py-32"
      tabIndex={-1}
    >
      <div className="container">
        <div className="mx-auto max-w-3xl text-center">
          <h1 className="mb-6 typography-display text-4xl sm:text-6xl md:text-7xl lg:text-8xl">
            <span className="block">{t('greeting')}</span>
            <span className="block text-primary">{tCommon('name')}</span>
          </h1>
          <div className="mb-8 color-block-primary brutalist-border inline-block">
            <p className="text-xl sm:text-2xl typography-headline px-6 py-4">
              {tCommon('title')}
            </p>
          </div>
          <p className="mb-10 text-lg leading-relaxed text-muted-foreground typography-body">
            {t('subtitle')}
          </p>
          <div className="flex flex-col gap-4 sm:flex-row sm:justify-center">
            <Link
              href={`/${locale}/works`}
              className="brutalist-button bg-primary text-primary-foreground px-8 py-4 typography-mono hover-lift transition-accessible inline-flex items-center justify-center"
            >
              {t('cta.projects')}
            </Link>
            <Link
              href={`/${locale}/contact`}
              className="brutalist-button bg-background border-border px-8 py-4 typography-mono hover-scale transition-accessible inline-flex items-center justify-center"
            >
              {t('cta.contact')}
            </Link>
          </div>
        </div>
      </div>
      
      {/* 背景装飾 */}
      <div className="fixed inset-0 pointer-events-none z-[-1] overflow-hidden" aria-hidden="true">
        <div className="absolute inset-0 experimental-grid"></div>
      </div>
    </section>
  );
}