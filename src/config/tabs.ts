import type { ComponentType } from 'react'
import { AboutPanel }      from '../panels/AboutPanel'
import { SkillsPanel }     from '../panels/SkillsPanel'
import { ExperiencePanel } from '../panels/ExperiencePanel'
import { ContactPanel }    from '../panels/ContactPanel'
import { ResumePanel }     from '../panels/ResumePanel'

export type Tab = 'about' | 'skills' | 'experience' | 'contact' | 'resume'

export type TabConfig = {
  id: Tab
  fileName: string
  lang: string
  Panel: ComponentType
}

// To add a new tab: add an entry here and create a panel in src/panels/
export const TABS: TabConfig[] = [
  { id: 'about',      fileName: 'about.ts',      lang: 'TypeScript', Panel: AboutPanel },
  { id: 'skills',     fileName: 'skills.json',   lang: 'JSON',       Panel: SkillsPanel },
  { id: 'experience', fileName: 'experience.ts', lang: 'TypeScript', Panel: ExperiencePanel },
  { id: 'contact',    fileName: 'contact.ts',    lang: 'TypeScript', Panel: ContactPanel },
  { id: 'resume',     fileName: 'resume.pdf',    lang: 'PDF',        Panel: ResumePanel },
]
