import type { ComponentType } from 'react'
import { AboutPanel }      from '../panels/AboutPanel'
import { SkillsPanel }     from '../panels/SkillsPanel'
import { ExperiencePanel } from '../panels/ExperiencePanel'
import { ContactPanel }    from '../panels/ContactPanel'

export type Tab = 'about' | 'skills' | 'experience' | 'contact'

export type TabConfig = {
  id: Tab
  fileName: string
  lang: string
  color: string
  Panel: ComponentType
}

// To add a new tab: add an entry here and create a panel in src/panels/
export const TABS: TabConfig[] = [
  { id: 'about',      fileName: 'about.ts',       lang: 'TypeScript', color: '#519aba', Panel: AboutPanel },
  { id: 'skills',     fileName: 'skills.json',    lang: 'JSON',       color: '#519aba', Panel: SkillsPanel },
  { id: 'experience', fileName: 'experience.ts',  lang: 'TypeScript', color: '#519aba', Panel: ExperiencePanel },
  { id: 'contact',    fileName: 'contact.ts',     lang: 'TypeScript', color: '#519aba', Panel: ContactPanel },
]
