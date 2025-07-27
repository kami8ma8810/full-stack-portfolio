import { headers } from 'next/headers';

export function getLocaleFromHeaders(): 'ja' | 'en' {
  const pathname = headers().get('x-pathname') || '';
  
  if (pathname.startsWith('/ja')) {
    return 'ja';
  } else if (pathname.startsWith('/en')) {
    return 'en';
  }
  
  return 'ja'; // default
}