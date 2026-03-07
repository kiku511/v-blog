import { about } from '../data/profile'
import { Line, Kw, Prop, Str, Cmt } from '../components/syntax'
import { cmdKey } from '../utils/platform'

export function AboutPanel() {
  return (
    <>
      <Line n={1}><Cmt c="// about.ts" /></Line>
      <Line n={2} />
      <Line n={3}><Cmt c="/**" /></Line>
      <Line n={4}><Cmt c=" * 👋 Hey there! You're looking at my portfolio, built to feel like home (VS Code)." /></Line>
      <Line n={5}><Cmt c={` * Poke around: ask the AI anything, hit ${cmdKey}+P to explore, crack open the terminal`} /></Line>
      <Line n={6}><Cmt c=" * with Ctrl+`, or enter the Konami code for a little surprise 🎮" /></Line>
      <Line n={7}><Cmt c=" */" /></Line>
      <Line n={8} />
      <Line n={9}><Kw c="const" /> <Prop c="vansh" /> {'= {'}</Line>
      <Line n={10}>{'  '}<Prop c="name" />{'     : '}<Str c={about.name} />{','}</Line>
      <Line n={11}>{'  '}<Prop c="role" />{'     : '}<Str c={about.role} />{','}</Line>
      <Line n={12}>{'  '}<Prop c="company" />{'  : '}<Str c={about.company} />{','}</Line>
      <Line n={13}>{'  '}<Prop c="location" />{' : '}<Str c={about.location} />{','}</Line>
      <Line n={14}>{'  '}<Prop c="bio" />{'      : '}<Str c={about.bio} /></Line>
      <Line n={15}>{'};'}</Line>
      <Line n={16} />
      <Line n={17}><Kw c="export default" /> <Prop c="vansh" />{'  ;'}</Line>
    </>
  )
}
