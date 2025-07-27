// Example of using translations in different scenarios

// 1. Client Component
'use client';
import { useTranslations } from 'next-intl';

export function ClientTranslationExample() {
  const t = useTranslations('common');
  return <div>{t('name')}</div>;
}

// 2. Server Component
import { getTranslations } from 'next-intl/server';

export async function ServerTranslationExample() {
  const t = await getTranslations('common');
  return <div>{t('name')}</div>;
}

// 3. With dynamic values
export function DynamicTranslationExample() {
  const t = useTranslations('footer');
  return <div>{t('copyright', { year: 2024, name: 'Hiro' })}</div>;
}

// 4. Using multiple namespaces
export function MultipleNamespacesExample() {
  const tCommon = useTranslations('common');
  const tNav = useTranslations('navigation');
  
  return (
    <div>
      <h1>{tCommon('title')}</h1>
      <nav>{tNav('home')}</nav>
    </div>
  );
}