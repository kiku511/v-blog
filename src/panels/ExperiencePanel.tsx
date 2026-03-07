import type { ReactNode } from 'react'
import { experience } from '../data/profile'
import { Line, Kw, Prop, Str, Cmt } from '../components/syntax'

function Promoted({ c }: { c: string }) {
  return <span style={{ color: 'var(--tp)' }}>{`"${c}"`}</span>
}

export function ExperiencePanel() {
  const lineContents: ReactNode[] = [
    <Cmt c="// experience.ts" />,
    null,
    <><Kw c="const" />{' '}<Prop c="experience" />{' = ['}</>,
  ]

  experience.forEach((entry, ei) => {
    const isLast = ei === experience.length - 1
    lineContents.push('  {')
    lineContents.push(<>{'    '}<Prop c="company" />{' : '}<Str c={entry.company} />{','}</>)
    if (entry.team) {
      lineContents.push(<>{'    '}<Prop c="team" />{'    : '}<Str c={entry.team} />{','}</>)
    }
    lineContents.push(<>{'    '}<Prop c="role" />{'    : '}<Str c={entry.role} />{','}</>)
    if (entry.promoted) {
      lineContents.push(<>{'    '}<Prop c="promoted" />{': '}<Promoted c={`↑ FE II · ${entry.promoted}`} />{','}</>)
    }
    lineContents.push(<>{'    '}<Prop c="period" />{'  : '}<Str c={entry.period} />{','}</>)
    lineContents.push(<>{'    '}<Prop c="bullets" />{' : ['}</>)
    entry.bullets.forEach((b, bi) => {
      lineContents.push(<>{'      '}<Cmt c={`// ${b}`} /></>)
    })
    lineContents.push('    ]')
    lineContents.push(isLast ? '  }' : '  },')
  })

  lineContents.push(']')
  lineContents.push(null)
  lineContents.push(<><Kw c="export default" />{' '}<Prop c="experience" />{';'}</>)

  return (
    <>
      {lineContents.map((content, i) => (
        <Line key={i} n={i + 1}>{content}</Line>
      ))}
    </>
  )
}
