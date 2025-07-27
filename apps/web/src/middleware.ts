import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  
  // Check if the pathname is missing a locale
  const pathnameHasLocale = /^\/(ja|en)(\/|$)/.test(pathname);
  
  if (pathnameHasLocale) {
    // Add pathname header for i18n config
    const requestHeaders = new Headers(request.headers);
    requestHeaders.set('x-pathname', pathname);
    
    return NextResponse.next({
      request: {
        headers: requestHeaders,
      },
    });
  }
  
  // Get locale from cookies or headers
  const cookieLocale = request.cookies.get('locale')?.value;
  const acceptLanguage = request.headers.get('accept-language');
  const browserLocale = acceptLanguage?.split(',')[0].split('-')[0];
  
  // Determine locale (priority: cookie > browser > default)
  let locale = 'ja'; // default
  if (cookieLocale && ['ja', 'en'].includes(cookieLocale)) {
    locale = cookieLocale;
  } else if (browserLocale && ['ja', 'en'].includes(browserLocale)) {
    locale = browserLocale;
  }
  
  // Redirect to the localized path
  const newUrl = new URL(`/${locale}${pathname}`, request.url);
  
  // Set locale cookie for future visits
  const response = NextResponse.redirect(newUrl);
  response.cookies.set('locale', locale, { path: '/' });
  
  // Add pathname header for i18n config
  response.headers.set('x-pathname', newUrl.pathname);
  
  return response;
}

export const config = {
  // Skip middleware for API routes, static files, etc.
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public folder
     */
    '/((?!api|_next/static|_next/image|favicon.ico|public).*)',
  ],
};