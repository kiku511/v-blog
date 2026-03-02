import { contact } from '../data/profile'
import { Line, Kw, Prop, Str, Cmt } from '../components/syntax'

export function ContactPanel() {
  return (
    <>
      <Line n={1}><Cmt c="// contact.ts" /></Line>
      <Line n={2} />
      <Line n={3}><Kw c="const" /> <Prop c="contact" /> {'= {'}</Line>
      <Line n={4}>{'  '}<Prop c="email" />{'   : '}<Str c={contact.email.label} href={contact.email.href} />{','}</Line>
      <Line n={5}>{'  '}<Prop c="website" />{' : '}<Str c={contact.website.label} href={contact.website.href} />{','}</Line>
      <Line n={6}>{'  '}<Prop c="linkedin" />{': '}<Str c={contact.linkedin.label} href={contact.linkedin.href} />{','}</Line>
      <Line n={7}>{'  '}<Prop c="github" />{'  : '}<Str c={contact.github.label} href={contact.github.href} />{','}</Line>
      <Line n={8}>{'};'}</Line>
      <Line n={9} />
      <Line n={10}><Kw c="export default" /> <Prop c="contact" />{'  ;'}</Line>
    </>
  )
}
