import { about } from '../data/profile'
import { Line, Kw, Prop, Str, Cmt } from '../components/syntax'
import { cmdKey } from '../utils/platform'

function yearsOfExperience() {
  const start = new Date(2020, 6, 1) // July 2020
  const now   = new Date()
  return Math.floor((now.getTime() - start.getTime()) / (1000 * 60 * 60 * 24 * 365.25))
}

export function AboutPanel() {
  const years = yearsOfExperience()
  const lineContents = [
    <Cmt c="// about.ts" />,
    null,
    <Cmt c="/**" />,
    <Cmt c=" * 👋 Hey there! You're looking at my portfolio, built to feel like home (VS Code)." />,
    <Cmt c={` * Poke around: ask the AI anything, hit ${cmdKey}+P to explore, crack open the terminal`} />,
    <Cmt c=" * with Ctrl+`, or enter the Konami code for a little surprise 🎮" />,
    <Cmt c=" *" />,
    <Cmt c={` * ${years} years building ambitious frontend products at scale,`} />,
    <Cmt c=" * from AWS no-code platforms to real-time drone control UIs." />,
    <Cmt c=" *" />,
    <Cmt c=" * I specialize in turning complex systems into clean, fast user experiences." />,
    <Cmt c=" * At AWS I led teams shipping 0-1 products used by thousands of customers." />,
    <Cmt c=" * Now at BRINC, I'm building real-time flight control software where" />,
    <Cmt c=" * performance is life-critical." />,
    <Cmt c=" *" />,
    <Cmt c=" * Source: github.com/kiku511/v-blog" />,
    <Cmt c=" */" />,
    null,
    <><Kw c="const" /> <Prop c="vansh" /> {'= {'}</>,
    <>{'  '}<Prop c="name" />{'     : '}<Str c={about.name} />{','}</>,
    <>{'  '}<Prop c="role" />{'     : '}<Str c={about.role} />{','}</>,
    <>{'  '}<Prop c="company" />{'  : '}<Str c={about.company} />{','}</>,
    <>{'  '}<Prop c="location" />{' : '}<Str c={about.location} /></>,
    <>{'};'}</>,
    null,
    <><Kw c="export default" /> <Prop c="vansh" />{'  ;'}</>,
  ]

  return (
    <>
      {lineContents.map((content, i) => (
        <Line key={i} n={i + 1}>{content}</Line>
      ))}
    </>
  )
}
