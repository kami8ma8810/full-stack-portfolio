export const locales = ['ja', 'en'] as const;
export type Locale = (typeof locales)[number];

export const defaultLocale: Locale = 'ja';

export const localeNames: Record<Locale, string> = {
  en: 'English',
  ja: '日本語',
};