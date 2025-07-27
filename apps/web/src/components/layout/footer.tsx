import Link from 'next/link';

const footerLinks = {
  main: [
    { name: 'Blog', href: '/blog' },
    { name: 'Works', href: '/works' },
    { name: 'About', href: '/about' },
    { name: 'Contact', href: '/contact' },
  ],
  social: [
    { name: 'GitHub', href: 'https://github.com/hirokikamiyama' },
    { name: 'Twitter', href: 'https://twitter.com/hirokikamiyama' },
    { name: 'LinkedIn', href: 'https://linkedin.com/in/hirokikamiyama' },
  ],
};

export function Footer() {
  return (
    <footer className="border-t">
      <div className="container py-8 md:py-12">
        <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
          <div className="space-y-3">
            <h3 className="text-lg font-semibold">Hiroki Kamiyama</h3>
            <p className="text-sm text-muted-foreground">
              Frontend Engineer passionate about creating exceptional web experiences.
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
            © {new Date().getFullYear()} Hiroki Kamiyama. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}