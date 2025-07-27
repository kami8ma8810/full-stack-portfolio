const experiences = [
  {
    title: 'Senior Frontend Engineer',
    company: 'Tech Company Inc.',
    period: '2022 - Present',
    description:
      'Leading frontend development for core products, mentoring junior developers, and implementing best practices for code quality and performance.',
    highlights: [
      'Led migration from JavaScript to TypeScript',
      'Improved app performance by 40%',
      'Established component library and design system',
    ],
  },
  {
    title: 'Frontend Developer',
    company: 'Startup XYZ',
    period: '2020 - 2022',
    description:
      'Built and maintained multiple web applications using React and Next.js. Collaborated closely with designers and backend engineers.',
    highlights: [
      'Developed key features for flagship product',
      'Implemented responsive design across all platforms',
      'Reduced bundle size by 30%',
    ],
  },
  {
    title: 'Junior Developer',
    company: 'Web Agency',
    period: '2018 - 2020',
    description:
      'Started my career building websites and web applications for various clients. Gained experience in multiple technologies and frameworks.',
    highlights: [
      'Delivered 20+ client projects',
      'Learned modern JavaScript frameworks',
      'Developed strong problem-solving skills',
    ],
  },
];

export function ExperienceSection() {
  return (
    <section className="mt-16">
      <h2 className="mb-6 text-2xl font-semibold">Experience</h2>
      <div className="space-y-8">
        {experiences.map((exp, index) => (
          <div key={index} className="relative pl-8 before:absolute before:left-0 before:top-2 before:h-2 before:w-2 before:rounded-full before:bg-primary">
            <div className="mb-1 flex flex-col gap-1 sm:flex-row sm:items-center sm:gap-2">
              <h3 className="text-lg font-medium">{exp.title}</h3>
              <span className="text-muted-foreground">at {exp.company}</span>
            </div>
            <p className="mb-2 text-sm text-muted-foreground">{exp.period}</p>
            <p className="mb-3 text-muted-foreground">{exp.description}</p>
            <ul className="space-y-1">
              {exp.highlights.map((highlight, i) => (
                <li key={i} className="flex items-start text-sm text-muted-foreground">
                  <span className="mr-2 mt-1 block h-1 w-1 flex-shrink-0 rounded-full bg-muted-foreground"></span>
                  {highlight}
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </section>
  );
}