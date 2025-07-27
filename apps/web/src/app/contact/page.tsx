import { Metadata } from 'next';
import { ContactForm } from '@/components/contact/contact-form';

export const metadata: Metadata = {
  title: 'Contact',
  description: 'Get in touch with me for collaborations or just to say hello.',
};

export default function ContactPage() {
  return (
    <div className="container py-12">
      <div className="mx-auto max-w-2xl">
        <h1 className="mb-8 text-4xl font-bold tracking-tight">Contact</h1>
        <p className="mb-12 text-lg text-muted-foreground">
          Have a project in mind or want to collaborate? I'd love to hear from
          you. Send me a message and I'll get back to you as soon as possible.
        </p>
        
        <div className="mb-12 space-y-6">
          <div>
            <h2 className="mb-2 text-lg font-semibold">Email</h2>
            <a
              href="mailto:hello@hirokikamiyama.com"
              className="text-muted-foreground hover:text-foreground"
            >
              hello@hirokikamiyama.com
            </a>
          </div>
          
          <div>
            <h2 className="mb-2 text-lg font-semibold">Social</h2>
            <div className="flex gap-4">
              <a
                href="https://github.com/hirokikamiyama"
                target="_blank"
                rel="noopener noreferrer"
                className="text-muted-foreground hover:text-foreground"
              >
                GitHub
              </a>
              <a
                href="https://twitter.com/hirokikamiyama"
                target="_blank"
                rel="noopener noreferrer"
                className="text-muted-foreground hover:text-foreground"
              >
                Twitter
              </a>
              <a
                href="https://linkedin.com/in/hirokikamiyama"
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