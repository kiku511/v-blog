import type { ReactNode } from 'react'
import { skills } from '../data/profile'
import { Line, Prop, Str, Cmt } from '../components/syntax'

export function SkillsPanel() {
  const entries = Object.entries(skills)

  const lineContents: ReactNode[] = [
    <Cmt c="// skills.json" />,
    null,
    '{',
  ]

  entries.forEach(([group, items], gi) => {
    lineContents.push(<>{'  '}<Prop c={`"${group}"`} />{': ['}</>)
    items.forEach((item, i) => {
      lineContents.push(<>{'    '}<Str c={item} />{i < items.length - 1 ? ',' : ''}</>)
    })
    lineContents.push(`  ]${gi < entries.length - 1 ? ',' : ''}`)
  })

  lineContents.push('}')

  return (
    <>
      {lineContents.map((content, i) => (
        <Line key={i} n={i + 1}>{content}</Line>
      ))}
    </>
  )
}
