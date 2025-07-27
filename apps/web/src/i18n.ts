import { notFound } from 'next/navigation';
import { getRequestConfig } from 'next-intl/server';
import { headers } from 'next/headers';

export default getRequestConfig(async () => {
  // Get locale from pathname
  const pathname = headers().get('x-pathname') || '';
  let locale = 'ja'; // default
  
  if (pathname.startsWith('/ja')) {
    locale = 'ja';
  } else if (pathname.startsWith('/en')) {
    locale = 'en';
  }
  
  // Load messages based on locale
  let messages;
  switch (locale) {
    case 'ja':
      messages = (await import('../messages/ja.json')).default;
      break;
    case 'en':
      messages = (await import('../messages/en.json')).default;
      break;
    default:
      messages = (await import('../messages/ja.json')).default;
  }

  return {
    locale,
    messages
  };
});