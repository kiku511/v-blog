export const about = {
  name:      'Vansh Gambhir',
  role:      'Software Engineer (Frontend)',
  company:   'BRINC Drones',
  location:  'Seattle, WA',
  tagline:   '6 years building ambitious frontend products at scale — from AWS no-code platforms to real-time drone control UIs.',
  bio:       "I specialize in turning complex systems into clean, fast user experiences. At AWS I led teams shipping 0-1 products used by thousands of customers. Now at BRINC, I'm building real-time flight control software where performance is life-critical.",
}

export const skills: Record<string, string[]> = {
  languages: ['TypeScript', 'JavaScript', 'PHP', 'Python', 'Java', 'Go', 'Swift'],
  frontend:  ['React', 'Vue', 'Node.js', 'Express', 'Laravel', 'HapiJS', 'GraphQL', 'CSS'],
  testing:   ['Cypress', 'Playwright', 'Vitest', 'React Testing Library'],
  tooling:   ['Vite', 'Docker', 'GitHub Actions', 'Vercel', 'Webpack', 'Storybook'],
  aws:       ['CloudFront', 'EC2', 'S3', 'Lambda', 'DynamoDB', 'AppSync', 'Bedrock', 'CloudWatch', 'SNS', 'IoT Core'],
  data:      ['Cassandra', 'MySQL', 'MongoDB', 'DynamoDB'],
}

export const experience: { company: string; team?: string; role: string; promoted?: string; period: string; bullets: string[] }[] = [
  {
    company: 'BRINC Drones',
    role:    'Software Engineer (Frontend)',
    period:  'Feb 2026 – Present',
    bullets: [
      'Building LiveOps platform for drone fleet management and real-time mission control.',
      'Working under strict real-time constraints with Vue, TypeScript, PHP, Laravel, and EC2.',
    ],
  },
  {
    company: 'Amazon Web Services',
    team:    'GenAI Agents',
    role:    'Front End Engineer II',
    period:  'Jan 2025 – Feb 2026',
    bullets: [
      'Built the Q Automate rendering engine: supports 1,000+ node graphs with custom DSL, comparable to n8n.',
      'Acted as security guardian: reviewed all feature launches, partnered with AppSec on threat models.',
    ],
  },
  {
    company:  'Amazon Web Services',
    team:     'App Studio & QApps',
    role:     'Front End Engineer',
    promoted: 'Jan 2023',
    period:   'Jul 2020 – Jan 2025',
    bullets: [
      'Led 0-1 delivery of AWS AppStudio, a no-code app builder, managing a team of 5 from Architecture through GA.',
      'Built reusable abstractions over 10+ AWS services (S3, Lambda, DynamoDB, AppSync) for the AppStudio runtime.',
      'Shipped in-house devtools accelerating feature delivery by 35%; built org-wide E2E infrastructure with Cypress.',
    ],
  },
  {
    company: 'Apple, Inc.',
    role:    'Software Engineer Intern',
    period:  'Jun 2019 – Sep 2019',
    bullets: [
      'Built an LDAP-backed feature flags API enabling per-employee rollouts across internal tooling.',
      'Contributed to internal design system componentization via Storybook.',
    ],
  },
]

export const contact = {
  email:    { label: 'vansh.gambhir@gmail.com',       href: 'mailto:vansh.gambhir@gmail.com' },
  website:  { label: 'vansh.dev',                     href: 'https://vansh.dev' },
  linkedin: { label: 'linkedin.com/in/vanshgambhir',  href: 'https://www.linkedin.com/in/vanshgambhir/' },
  github:   { label: 'github.com/kiku511',            href: 'https://github.com/kiku511' },
}
