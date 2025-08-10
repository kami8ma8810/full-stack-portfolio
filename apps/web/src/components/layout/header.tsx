'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useState, useEffect } from 'react';
import { useTranslations, useLocale } from 'next-intl';
import { cn } from '@/lib/utils';
import { LanguageSwitcher } from '@/components/language-switcher';

interface HeaderProps {
  activeSection?: string;
}

export function Header({ activeSection }: HeaderProps) {
  const pathname = usePathname();
  const locale = useLocale();
  const t = useTranslations('navigation');
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);

  const navigation = [
    { name: t('home'), href: `/${locale}`, id: 'hero' },
    { name: t('projects'), href: `/${locale}/works`, id: 'product' },
    { name: t('about'), href: `/${locale}/about`, id: 'about' },
    { name: t('contact'), href: `/${locale}/contact`, id: 'contact' },
  ];

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isMenuOpen) {
        setIsMenuOpen(false);
      }
    };

    window.addEventListener('scroll', handleScroll);
    document.addEventListener('keydown', handleKeyDown);
    
    return () => {
      window.removeEventListener('scroll', handleScroll);
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [isMenuOpen]);

  useEffect(() => {
    if (isMenuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }

    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isMenuOpen]);

  const scrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
      element.setAttribute('tabindex', '-1');
      element.focus();
    }
    setIsMenuOpen(false);
  };

  // ホームページの場合はスクロール機能を使用、それ以外は通常のリンク
  const isHomePage = pathname === `/${locale}`;

  return (
    <header className={cn(
      "sticky top-0 z-50 w-full transition-all duration-300",
      isScrolled 
        ? "brutalist-border border-t-0 border-l-0 border-r-0 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60" 
        : "bg-transparent"
    )}>
      <nav className="container flex h-16 items-center">
        <Link href="/" className="mr-6 flex items-center space-x-2">
          <span className="hidden typography-display text-2xl text-primary sm:inline-block">
            HANK
          </span>
          <span className="typography-display text-2xl text-primary sm:hidden">H</span>
        </Link>

        <div className="hidden flex-1 items-center justify-end space-x-6 md:flex">
          {navigation.map((item) => {
            if (isHomePage && item.id) {
              return (
                <button
                  key={item.id}
                  onClick={() => scrollToSection(item.id)}
                  className={cn(
                    'typography-mono text-sm transition-all hover-glow px-3 py-2 rounded',
                    activeSection === item.id
                      ? 'text-primary font-bold'
                      : 'text-muted-foreground hover:text-foreground'
                  )}
                >
                  {item.name}
                </button>
              );
            }
            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  'typography-mono text-sm transition-all hover-glow px-3 py-2 rounded',
                  pathname === item.href
                    ? 'text-primary font-bold'
                    : 'text-muted-foreground hover:text-foreground'
                )}
              >
                {item.name}
              </Link>
            );
          })}
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
        <div className="brutalist-border border-l-0 border-r-0 border-b-0 md:hidden">
          <div className="container grid gap-2 py-4">
            {navigation.map((item) => {
              if (isHomePage && item.id) {
                return (
                  <button
                    key={item.id}
                    onClick={() => scrollToSection(item.id)}
                    className={cn(
                      'brutalist-button px-4 py-3 typography-mono text-sm transition-all',
                      activeSection === item.id
                        ? 'bg-primary text-primary-foreground'
                        : 'bg-background text-muted-foreground hover:text-foreground'
                    )}
                  >
                    {item.name}
                  </button>
                );
              }
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setIsMenuOpen(false)}
                  className={cn(
                    'brutalist-button px-4 py-3 typography-mono text-sm transition-all',
                    pathname === item.href
                      ? 'bg-primary text-primary-foreground'
                      : 'bg-background text-muted-foreground hover:text-foreground'
                  )}
                >
                  {item.name}
                </Link>
              );
            })}
            <div className="px-3 py-2">
              <LanguageSwitcher />
            </div>
          </div>
        </div>
      )}
    </header>
  );
}