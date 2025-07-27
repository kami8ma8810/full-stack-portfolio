import Link from 'next/link';

// Server Component版のHero
export function HeroServer() {
  return (
    <section className="relative overflow-hidden py-20 sm:py-32">
      <div className="container">
        <div className="mx-auto max-w-3xl text-center">
          <h1 className="mb-6 text-4xl font-bold tracking-tight sm:text-6xl">
            Hi, I&apos;m Hank
          </h1>
          <p className="mb-8 text-xl text-muted-foreground sm:text-2xl">
            Frontend Engineer
          </p>
          <p className="mb-10 text-lg leading-relaxed text-muted-foreground">
            I craft exceptional digital experiences with modern web technologies.
            Passionate about clean code, intuitive design, and pushing the boundaries
            of what&apos;s possible on the web.
          </p>
          <div className="flex flex-col gap-4 sm:flex-row sm:justify-center">
            <Link
              href="/works"
              className="inline-flex h-11 items-center justify-center rounded-md bg-primary px-8 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
            >
              View My Work
            </Link>
            <Link
              href="/contact"
              className="inline-flex h-11 items-center justify-center rounded-md border border-input bg-background px-8 text-sm font-medium transition-colors hover:bg-accent hover:text-accent-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
            >
              Get In Touch
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}