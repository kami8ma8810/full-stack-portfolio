'use client';

import Link from 'next/link';
import { useTranslations, useLocale } from 'next-intl';

export function Footer() {
  const t = useTranslations('navigation');
  const tCommon = useTranslations('common');
  const tFooter = useTranslations('footer');
  const locale = useLocale();

  const footerLinks = {
    main: [
      { name: t('projects'), href: `/${locale}/works` },
      { name: t('about'), href: `/${locale}/about` },
      { name: t('contact'), href: `/${locale}/contact` },
    ],
    social: [
      { name: 'GitHub', href: 'https://github.com/hankkamy' },
      { name: 'Twitter', href: 'https://twitter.com/hankkamy' },
      { name: 'LinkedIn', href: 'https://linkedin.com/in/hankkamy' },
    ],
  };
  return (
    <footer className="brutalist-border border-b-0 border-l-0 border-r-0 color-block-secondary">
      <div className="container py-8 md:py-12">
        <div className="asymmetric-grid grid-cols-1 md:grid-cols-3">
          <div className="space-y-3">
            <h3 className="typography-headline text-xl text-primary">{tCommon('name')}</h3>
            <p className="typography-body text-sm">
              {tCommon('description')}
            </p>
          </div>

          <div className="space-y-3">
            <h4 className="typography-mono text-sm font-semibold">PAGES</h4>
            <ul className="space-y-2">
              {footerLinks.main.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="typography-mono text-sm hover-glow inline-block py-1 transition-all"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div className="space-y-3">
            <h4 className="typography-mono text-sm font-semibold">CONNECT</h4>
            <ul className="space-y-2">
              {footerLinks.social.map((link) => (
                <li key={link.href}>
                  <a
                    href={link.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="typography-mono text-sm hover-glow inline-block py-1 transition-all"
                  >
                    {link.name}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="mt-8 brutalist-border border-b-0 border-l-0 border-r-0 pt-8">
          <p className="text-center typography-mono text-sm">
            {tFooter('copyright', { year: new Date().getFullYear(), name: tCommon('name') })}
          </p>
        </div>
      </div>
    </footer>
  );
}