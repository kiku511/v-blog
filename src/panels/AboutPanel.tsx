import { about } from '../data/profile'
import { Line, Kw, Prop, Str, Cmt } from '../components/syntax'
import { cmdKey, termKey } from '../utils/platform'

export function AboutPanel() {
  return (
    <>
      <Line n={1}><Cmt c="// about.ts" /></Line>
      <Line n={2}><Cmt c="// 👋 Hey there! You're looking at my portfolio, built to feel like home (VS Code)." /></Line>
      <Line n={3}><Cmt c={`// Poke around: ask the AI anything, hit ${cmdKey}+P to explore, crack open the terminal`} /></Line>
      <Line n={4}><Cmt c={`// with ${termKey}+\`, or enter the Konami code for a little surprise 🎮`} /></Line>
      <Line n={5} />
      <Line n={6}><Kw c="const" /> <Prop c="vansh" /> {'= {'}</Line>
      <Line n={7}>{'  '}<Prop c="name" />{'     : '}<Str c={about.name} />{','}</Line>
      <Line n={8}>{'  '}<Prop c="role" />{'     : '}<Str c={about.role} />{','}</Line>
      <Line n={9}>{'  '}<Prop c="company" />{'  : '}<Str c={about.company} />{','}</Line>
      <Line n={10}>{'  '}<Prop c="location" />{' : '}<Str c={about.location} />{','}</Line>
      <Line n={11}>{'  '}<Prop c="bio" />{'      : '}<Str c={about.bio} /></Line>
      <Line n={12}>{'};'}</Line>
      <Line n={13} />
      <Line n={14}><Kw c="export default" /> <Prop c="vansh" />{'  ;'}</Line>
    </>
  )
}
