export const about = {
  name:     'Vansh Gambhir',
  role:     'Software Engineer (Frontend)',
  company:  'BRINC Drones',
  location: 'Seattle, WA',
  bio:      'Building fast, beautiful web experiences.',
}

export const skills: Record<string, string[]> = {
  languages: ['TypeScript', 'JavaScript', 'Python', 'Java', 'Go', 'Swift'],
  frontend:  ['React', 'Next.js', 'Node.js', 'Express', 'GraphQL', 'CSS'],
  state:     ['Redux Toolkit', 'Zustand', 'React Query'],
  testing:   ['Jest', 'React Testing Library', 'Cypress', 'Playwright', 'Vitest'],
  tooling:   ['Vite', 'Webpack', 'esbuild', 'Storybook'],
  aws:       ['CloudFront', 'EC2', 'S3', 'Lambda', 'DynamoDB', 'AppSync', 'Bedrock', 'CloudWatch', 'SNS'],
  data:      ['Cassandra', 'MySQL', 'MongoDB', 'Pandas', 'Redshift'],
}

export const experience: { company: string; team?: string; role: string; period: string }[] = [
  { company: 'BRINC Drones',          role: 'Software Engineer (Frontend)', period: '2025 – Present'       },
  { company: 'Amazon Web Services',   team: 'GenAI Agents',       role: 'Front End Engineer II',  period: 'Jan 2025 – 2025'     },
  { company: 'Amazon Web Services',   team: 'App Studio & QApps', role: 'Front End Engineer',     period: 'Jul 2020 – Jan 2025'  },
  { company: 'Apple, Inc.',           role: 'Software Engineer Intern',     period: 'Jun 2019 – Sep 2019'  },
]

export const contact = {
  email:    { label: 'vansh.gambhir@gmail.com',       href: 'mailto:vansh.gambhir@gmail.com' },
  website:  { label: 'vansh.dev',                     href: 'https://vansh.dev' },
  linkedin: { label: 'linkedin.com/in/vanshgambhir',  href: 'https://www.linkedin.com/in/vanshgambhir/' },
  github:   { label: 'github.com/kiku511',            href: 'https://github.com/kiku511' },
}
