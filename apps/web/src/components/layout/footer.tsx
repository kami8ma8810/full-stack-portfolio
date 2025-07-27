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
    <footer className="border-t">
      <div className="container py-8 md:py-12">
        <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
          <div className="space-y-3">
            <h3 className="text-lg font-semibold">{tCommon('name')}</h3>
            <p className="text-sm text-muted-foreground">
              {tCommon('description')}
            </p>
          </div>

          <div className="space-y-3">
            <h4 className="text-sm font-semibold">Pages</h4>
            <ul className="space-y-2">
              {footerLinks.main.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-sm text-muted-foreground hover:text-foreground"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div className="space-y-3">
            <h4 className="text-sm font-semibold">Connect</h4>
            <ul className="space-y-2">
              {footerLinks.social.map((link) => (
                <li key={link.href}>
                  <a
                    href={link.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-sm text-muted-foreground hover:text-foreground"
                  >
                    {link.name}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="mt-8 border-t pt-8">
          <p className="text-center text-sm text-muted-foreground">
            {tFooter('copyright', { year: new Date().getFullYear(), name: tCommon('name') })}
          </p>
        </div>
      </div>
    </footer>
  );
}