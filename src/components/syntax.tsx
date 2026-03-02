import type { ReactNode } from 'react'

export function Kw({ c }: { c: string }) {
  return <span className="kw">{c}</span>
}

export function Prop({ c }: { c: string }) {
  return <span className="prop">{c}</span>
}

export function Str({ c, href }: { c: string; href?: string }) {
  const text = `"${c}"`
  return href
    ? <a className="str" href={href} target="_blank" rel="noopener">{text}</a>
    : <span className="str">{text}</span>
}

export function Cmt({ c }: { c: string }) {
  return <span className="cmt">{c}</span>
}

export function Line({ n, children }: { n: number; children?: ReactNode }) {
  return (
    <div className="cl">
      <span className="ln">{n}</span>
      <span className="lc">{children}</span>
    </div>
  )
}
