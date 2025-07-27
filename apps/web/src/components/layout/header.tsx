'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useState } from 'react';
import { useTranslations, useLocale } from 'next-intl';
import { cn } from '@/lib/utils';
import { LanguageSwitcher } from '@/components/language-switcher';

export function Header() {
  const pathname = usePathname();
  const locale = useLocale();
  const t = useTranslations('navigation');
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const navigation = [
    { name: t('home'), href: `/${locale}` },
    { name: t('projects'), href: `/${locale}/works` },
    { name: t('about'), href: `/${locale}/about` },
    { name: t('contact'), href: `/${locale}/contact` },
  ];

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <nav className="container flex h-16 items-center">
        <Link href="/" className="mr-6 flex items-center space-x-2">
          <span className="hidden font-bold sm:inline-block">
            Hank
          </span>
          <span className="font-bold sm:hidden">H</span>
        </Link>

        <div className="hidden flex-1 items-center justify-end space-x-6 md:flex">
          {navigation.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                'text-sm font-medium transition-colors hover:text-primary',
                pathname === item.href
                  ? 'text-foreground'
                  : 'text-muted-foreground'
              )}
            >
              {item.name}
            </Link>
          ))}
          <LanguageSwitcher />
        </div>

        <button
          type="button"
          className="ml-auto flex h-9 w-9 items-center justify-center rounded-md text-muted-foreground hover:text-foreground md:hidden"
          onClick={() => setIsMenuOpen(!isMenuOpen)}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={1.5}
            stroke="currentColor"
            className="h-6 w-6"
          >
            {isMenuOpen ? (
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M6 18L18 6M6 6l12 12"
              />
            ) : (
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5"
              />
            )}
          </svg>
          <span className="sr-only">Toggle menu</span>
        </button>
      </nav>

      {isMenuOpen && (
        <div className="border-t md:hidden">
          <div className="container grid gap-2 py-4">
            {navigation.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setIsMenuOpen(false)}
                className={cn(
                  'rounded-md px-3 py-2 text-sm font-medium transition-colors hover:bg-accent hover:text-accent-foreground',
                  pathname === item.href
                    ? 'bg-accent/50 text-foreground'
                    : 'text-muted-foreground'
                )}
              >
                {item.name}
              </Link>
            ))}
            <div className="px-3 py-2">
              <LanguageSwitcher />
            </div>
          </div>
        </div>
      )}
    </header>
  );
}