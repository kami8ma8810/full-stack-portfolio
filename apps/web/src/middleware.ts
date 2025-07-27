import createMiddleware from 'next-intl/middleware';
import { locales, defaultLocale } from '@/config/i18n';

export default createMiddleware({
  // A list of all locales that are supported
  locales,
  
  // Used when no locale matches
  defaultLocale,
  
  // Disable automatic locale detection based on headers
  localeDetection: true,
});

export const config = {
  // Match only internationalized pathnames
  matcher: ['/', '/(ja|en)/:path*', '/((?!api|_next|_vercel|.*\\..*).*)']
};