import { Metadata } from 'next';
import { ContactForm } from '@/components/contact/contact-form';
import { unstable_setRequestLocale } from 'next-intl/server';
import { getTranslations } from 'next-intl/server';

export async function generateMetadata({ params: { locale } }: { params: { locale: string } }): Promise<Metadata> {
  const t = await getTranslations({ locale, namespace: 'contact' });
  
  return {
    title: t('title'),
    description: t('subtitle'),
  };
}

export default async function ContactPage({ params: { locale } }: { params: { locale: string } }) {
  unstable_setRequestLocale(locale);
  const t = await getTranslations('contact');
  
  return (
    <div className="container py-12">
      <div className="mx-auto max-w-2xl">
        <h1 className="mb-8 text-4xl font-bold tracking-tight">{t('title')}</h1>
        <p className="mb-12 text-lg text-muted-foreground">
          {t('subtitle')}
        </p>
        
        <div className="mb-12 space-y-6">
          <div>
            <h2 className="mb-2 text-lg font-semibold">Email</h2>
            <a
              href="mailto:hello@hankkamy.com"
              className="text-muted-foreground hover:text-foreground"
            >
              hello@hankkamy.com
            </a>
          </div>
          
          <div>
            <h2 className="mb-2 text-lg font-semibold">Social</h2>
            <div className="flex gap-4">
              <a
                href="https://github.com/hankkamy"
                target="_blank"
                rel="noopener noreferrer"
                className="text-muted-foreground hover:text-foreground"
              >
                GitHub
              </a>
              <a
                href="https://twitter.com/hankkamy"
                target="_blank"
                rel="noopener noreferrer"
                className="text-muted-foreground hover:text-foreground"
              >
                Twitter
              </a>
              <a
                href="https://linkedin.com/in/hankkamy"
                target="_blank"
                rel="noopener noreferrer"
                className="text-muted-foreground hover:text-foreground"
              >
                LinkedIn
              </a>
            </div>
          </div>
        </div>

        <ContactForm />
      </div>
    </div>
  );
}