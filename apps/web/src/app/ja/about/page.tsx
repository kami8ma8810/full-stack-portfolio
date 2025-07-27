import { Metadata } from 'next';
import Image from 'next/image';
import { SkillsSection } from '@/components/about/skills-section';
import { ExperienceSection } from '@/components/about/experience-section';

export const metadata: Metadata = {
  title: 'About',
  description: 'Learn more about me and my journey as a frontend engineer.',
};

export default function AboutPage() {
  return (
    <div className="container py-12">
      <div className="mx-auto max-w-4xl">
        <h1 className="mb-8 text-4xl font-bold tracking-tight">About Me</h1>
        
        <div className="mb-12 flex flex-col gap-8 md:flex-row md:gap-12">
          <div className="mx-auto h-48 w-48 flex-shrink-0 overflow-hidden rounded-full bg-muted md:mx-0">
            {/* プロフィール画像のプレースホルダー */}
          </div>
          
          <div className="space-y-4 text-lg leading-relaxed text-muted-foreground">
            <p>
              Hi, I&apos;m Hank (formally Hayato Kamiyama), a Japanese frontend engineer with a love
              for creating beautiful, functional, and accessible web experiences.
            </p>
            <p>
              I go by Hank professionally. I specialize in React, TypeScript, and modern web technologies. I
              believe in writing clean, maintainable code and building products
              that make a difference in people&apos;s lives.
            </p>
            <p>
              When I&apos;m not coding, you can find me exploring new technologies,
              contributing to open source projects, or sharing my knowledge
              through blog posts and talks.
            </p>
          </div>
        </div>

        <SkillsSection />
        <ExperienceSection />

        <section className="mt-16">
          <h2 className="mb-6 text-2xl font-semibold">Get in Touch</h2>
          <p className="text-lg text-muted-foreground">
            I&apos;m always interested in hearing about new opportunities and
            interesting projects. Feel free to reach out if you&apos;d like to work
            together or just want to say hello!
          </p>
        </section>
      </div>
    </div>
  );
}