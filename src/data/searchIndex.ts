import { about, skills, experience, contact } from './profile'
import { cmdKey } from '../utils/platform'
import type { Tab } from '../config/tabs'

export type SearchEntry = { tab: Tab; fileName: string; line: number; text: string }

function makeIndex(): SearchEntry[] {
  const entries: SearchEntry[] = []

  function add(tab: Tab, fileName: string, lines: string[]) {
    lines.forEach((text, i) => {
      if (text.trim()) entries.push({ tab, fileName, line: i + 1, text })
    })
  }

  add('about', 'about.ts', [
    '// about.ts',
    '/**',
    " * 👋 Hey there! You're looking at my portfolio, built to feel like home (VS Code).",
    ` * Poke around: ask the AI anything, hit ${cmdKey}+P to explore, crack open the terminal`,
    ' * with Ctrl+`, or enter the Konami code for a little surprise 🎮',
    ' */',
    '',
    'const vansh = {',
    `  name     : "${about.name}",`,
    `  role     : "${about.role}",`,
    `  company  : "${about.company}",`,
    `  location : "${about.location}",`,
    `  bio      : "${about.bio}"`,
    '};',
    '',
    'export default vansh;',
  ])

  const skillLines = ['// skills.json', '', '{']
  Object.entries(skills).forEach(([group, items], gi, arr) => {
    skillLines.push(`  "${group}": [`)
    items.forEach((item, i) => skillLines.push(`    "${item}"${i < items.length - 1 ? ',' : ''}`))
    skillLines.push(`  ]${gi < arr.length - 1 ? ',' : ''}`)
  })
  skillLines.push('}')
  add('skills', 'skills.json', skillLines)

  const expLines = ['// experience.ts', '', 'const experience = [']
  experience.forEach((e, ei) => {
    expLines.push('  {')
    expLines.push(`    company : "${e.company}",`)
    if (e.team) expLines.push(`    team    : "${e.team}",`)
    expLines.push(`    role    : "${e.role}",`)
    if (e.promoted) expLines.push(`    promoted: "↑ FE II · ${e.promoted}",`)
    expLines.push(`    period  : "${e.period}"`)
    expLines.push(ei < experience.length - 1 ? '  },' : '  }')
  })
  expLines.push(']', '', 'export default experience;')
  add('experience', 'experience.ts', expLines)

  add('contact', 'contact.ts', [
    '// contact.ts',
    '',
    'const contact = {',
    `  email   : "${contact.email.label}",`,
    `  website : "${contact.website.label}",`,
    `  linkedin: "${contact.linkedin.label}",`,
    `  github  : "${contact.github.label}",`,
    '};',
    '',
    'export default contact;',
  ])

  return entries
}

export const SEARCH_INDEX = makeIndex()
