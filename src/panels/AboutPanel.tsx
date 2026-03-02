import { about } from '../data/profile'
import { Line, Kw, Prop, Str, Cmt } from '../components/syntax'

export function AboutPanel() {
  return (
    <>
      <Line n={1}><Cmt c="// about.ts" /></Line>
      <Line n={2} />
      <Line n={3}><Kw c="const" /> <Prop c="vansh" /> {'= {'}</Line>
      <Line n={4}>{'  '}<Prop c="name" />{'     : '}<Str c={about.name} />{','}</Line>
      <Line n={5}>{'  '}<Prop c="role" />{'     : '}<Str c={about.role} />{','}</Line>
      <Line n={6}>{'  '}<Prop c="company" />{'  : '}<Str c={about.company} />{','}</Line>
      <Line n={7}>{'  '}<Prop c="location" />{' : '}<Str c={about.location} />{','}</Line>
      <Line n={8}>{'  '}<Prop c="bio" />{'      : '}<Str c={about.bio} /></Line>
      <Line n={9}>{'};'}</Line>
      <Line n={10} />
      <Line n={11}><Kw c="export default" /> <Prop c="vansh" />{'  ;'}</Line>
    </>
  )
}
