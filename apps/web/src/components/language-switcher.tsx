'use client';

import { usePathname, useRouter } from 'next/navigation';
import { locales, localeNames, type Locale } from '@/config/i18n';
import { cn } from '@/lib/utils';
import { useCurrentLocale } from '@/hooks/use-current-locale';

export function LanguageSwitcher() {
  const currentLocale = useCurrentLocale();
  const router = useRouter();
  const pathname = usePathname();

  const handleLocaleChange = (newLocale: Locale) => {
    // Replace the locale in the pathname
    const newPathname = pathname.replace(/^\/(ja|en)/, `/${newLocale}`);
    
    // Set locale cookie
    document.cookie = `locale=${newLocale};path=/`;
    
    router.push(newPathname);
  };

  return (
    <div className="flex items-center gap-1">
      {locales.map((loc) => (
        <button
          key={loc}
          onClick={() => handleLocaleChange(loc)}
          className={cn(
            "px-2 py-1 text-sm font-medium rounded transition-colors",
            currentLocale === loc
              ? "bg-primary text-primary-foreground"
              : "text-muted-foreground hover:text-foreground hover:bg-accent"
          )}
          aria-label={`Switch to ${localeNames[loc]}`}
        >
          {loc.toUpperCase()}
        </button>
      ))}
    </div>
  );
}