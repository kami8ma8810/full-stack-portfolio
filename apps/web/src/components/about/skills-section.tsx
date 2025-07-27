const skills = {
  'Frontend': [
    'React',
    'Next.js',
    'TypeScript',
    'JavaScript (ES6+)',
    'HTML5',
    'CSS3',
    'Tailwind CSS',
    'Styled Components',
  ],
  'Backend': [
    'Node.js',
    'Express',
    'Hono',
    'REST APIs',
    'GraphQL',
    'PostgreSQL',
    'MongoDB',
    'Redis',
  ],
  'Tools & Others': [
    'Git',
    'Docker',
    'CI/CD',
    'Jest',
    'Vitest',
    'Webpack',
    'Vite',
    'Figma',
  ],
};

export function SkillsSection() {
  return (
    <section className="mt-16">
      <h2 className="mb-6 text-2xl font-semibold">Skills</h2>
      <div className="grid gap-8 md:grid-cols-3">
        {Object.entries(skills).map(([category, items]) => (
          <div key={category}>
            <h3 className="mb-3 text-lg font-medium">{category}</h3>
            <ul className="space-y-2">
              {items.map((skill) => (
                <li
                  key={skill}
                  className="flex items-center text-muted-foreground"
                >
                  <span className="mr-2 text-primary">•</span>
                  {skill}
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </section>
  );
}