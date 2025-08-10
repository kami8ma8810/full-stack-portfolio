'use client';

import { User, Code, Palette, Lightbulb, ArrowUpRight, Download } from 'lucide-react';
import { useTranslations } from 'next-intl';

export function AboutSection() {
  const t = useTranslations('about');
  const tCommon = useTranslations('common');

  const skills = [
    {
      icon: <Code className="text-primary" size={48} />,
      title: 'DEVELOPMENT',
      description: t('skills.development.description'),
      technologies: ['React', 'TypeScript', 'Node.js', 'Next.js', 'Python'],
    },
    {
      icon: <Palette className="text-primary" size={48} />,
      title: 'DESIGN',
      description: t('skills.design.description'),
      technologies: ['Figma', 'UI/UX', 'Design Systems', 'Prototyping'],
    },
    {
      icon: <Lightbulb className="text-primary" size={48} />,
      title: 'STRATEGY',
      description: t('skills.strategy.description'),
      technologies: ['Product Strategy', 'Tech Leadership', 'Innovation'],
    },
  ];

  const experience = [
    {
      year: '2023-2025',
      role: 'SENIOR FULL-STACK DEVELOPER',
      company: 'TECH COMPANY INC.',
      description: t('experience.senior.description'),
    },
    {
      year: '2021-2023',
      role: 'UI/UX DESIGNER & DEVELOPER',
      company: 'DESIGN STUDIO',
      description: t('experience.designer.description'),
    },
    {
      year: '2019-2021',
      role: 'FRONTEND DEVELOPER',
      company: 'STARTUP VENTURES',
      description: t('experience.frontend.description'),
    },
  ];

  return (
    <section
      id="about"
      className="py-32 bg-background relative"
      aria-labelledby="about-heading"
      tabIndex={-1}
    >
      {/* セクション番号 */}
      <div className="absolute left-8 top-16 -rotate-90" aria-hidden="true">
        <span className="typography-mono text-xs text-muted-foreground">02 — ABOUT</span>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* ヘッダー */}
        <div className="asymmetric-grid mb-20">
          <div></div>
          <div>
            <h2 id="about-heading" className="typography-display text-5xl md:text-7xl mb-8">
              ABOUT
              <br />
              <span className="text-primary">ME</span>
            </h2>
            <div className="color-block-primary brutalist-border">
              <p className="typography-body text-lg p-6">
                {t('intro.part1')}
                <span className="text-primary-foreground typography-mono"> design & development</span>
                {t('intro.part2')}
              </p>
            </div>
          </div>
          <div></div>
        </div>

        {/* メインコンテンツ */}
        <div className="grid lg:grid-cols-5 gap-16 mb-32">
          {/* プロフィールセクション */}
          <div className="lg:col-span-2 space-y-8">
            <div className="layered-composition">
              <div className="brutalist-border bg-secondary p-8 hover-lift transition-accessible">
                <div className="flex items-center space-x-4 mb-6">
                  <div className="bg-primary text-primary-foreground p-4 brutalist-border">
                    <User size={32} />
                  </div>
                  <div>
                    <h3 className="typography-headline text-xl">PROFILE</h3>
                    <p className="typography-mono text-sm text-muted-foreground">
                      {tCommon('title')}
                    </p>
                  </div>
                </div>

                <div className="space-y-4">
                  <p className="typography-body">{t('profile.description1')}</p>
                  <p className="typography-body">{t('profile.description2')}</p>
                </div>

                <button className="mt-6 brutalist-button bg-background px-6 py-3 typography-mono hover-scale transition-accessible inline-flex items-center">
                  <Download size={16} className="mr-2" />
                  DOWNLOAD CV
                </button>
              </div>
            </div>

            {/* 統計情報 */}
            <div className="grid grid-cols-2 gap-4">
              <div className="brutalist-border bg-background text-center p-6 hover-lift transition-accessible">
                <div className="typography-display text-3xl">50+</div>
                <div className="typography-mono text-xs text-muted-foreground">PROJECTS</div>
              </div>
              <div className="color-block-primary text-center p-6 hover-scale transition-accessible">
                <div className="typography-display text-3xl">100%</div>
                <div className="typography-mono text-xs text-primary-foreground opacity-70">
                  SATISFACTION
                </div>
              </div>
              <div className="brutalist-border bg-primary text-primary-foreground text-center p-6 hover-lift transition-accessible">
                <div className="typography-display text-3xl">5+</div>
                <div className="typography-mono text-xs opacity-70">YEARS</div>
              </div>
              <div className="brutalist-border bg-secondary text-center p-6 hover-scale transition-accessible">
                <div className="typography-display text-3xl">24/7</div>
                <div className="typography-mono text-xs text-muted-foreground">SUPPORT</div>
              </div>
            </div>
          </div>

          {/* スキルセクション */}
          <div className="lg:col-span-3">
            <h3 className="typography-headline text-3xl mb-8">MY EXPERTISE</h3>
            <div className="asymmetric-cards">
              {skills.map((skill, index) => (
                <div
                  key={index}
                  className="brutalist-border bg-card p-8 hover-lift transition-accessible group"
                >
                  <div className="flex items-start justify-between mb-6">
                    <div className="group-hover:hover-glow transition-accessible">{skill.icon}</div>
                    <ArrowUpRight
                      size={20}
                      className="text-muted-foreground opacity-0 group-hover:opacity-100 transition-accessible"
                    />
                  </div>

                  <h4 className="typography-headline text-xl mb-2">{skill.title}</h4>
                  <p className="typography-body text-muted-foreground mb-6">{skill.description}</p>

                  <div className="space-y-2">
                    {skill.technologies.map((tech, techIndex) => (
                      <span
                        key={techIndex}
                        className="inline-block mr-2 mb-2 px-3 py-1 bg-secondary text-foreground typography-mono text-xs brutalist-border hover-scale transition-accessible"
                      >
                        {tech}
                      </span>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* 経験セクション */}
        <div className="space-y-12">
          <h3 className="typography-headline text-3xl">MY JOURNEY</h3>
          <div className="space-y-8">
            {experience.map((exp, index) => (
              <div
                key={index}
                className="grid md:grid-cols-4 gap-8 items-start brutalist-border bg-background p-8 hover-lift transition-accessible"
              >
                <div className="md:col-span-1">
                  <span className="typography-mono bg-primary text-primary-foreground px-3 py-1 text-xs brutalist-border">
                    {exp.year}
                  </span>
                </div>
                <div className="md:col-span-2">
                  <h4 className="typography-headline text-lg mb-2">{exp.role}</h4>
                  <p className="typography-mono text-sm text-primary mb-2">{exp.company}</p>
                  <p className="typography-body text-muted-foreground">{exp.description}</p>
                </div>
                <div className="md:col-span-1 flex justify-end">
                  <ArrowUpRight
                    size={24}
                    className="text-muted-foreground hover:text-primary transition-accessible"
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* 装飾的要素 */}
      <div className="absolute right-0 top-0 bottom-0 w-px bg-border" aria-hidden="true"></div>
    </section>
  );
}