import type { Tab } from '../config/tabs'

// [colorType, widthPercent] | null (null = blank line)
type MinimapLine = [string, number] | null

const MAPS: Record<string, MinimapLine[]> = {
  about: [
    // // about.ts
    ['cmt', 55],
    null,
    // /** ... */
    ['cmt', 12],
    ['cmt', 85], ['cmt', 80], ['cmt', 70],
    ['cmt', 8],
    ['cmt', 68], ['cmt', 64],
    ['cmt', 8],
    ['cmt', 74], ['cmt', 76], ['cmt', 70], ['cmt', 44],
    ['cmt', 10],
    null,
    // const vansh = { ... }
    ['kw', 42],
    ['prop', 44], ['str', 38],
    ['prop', 44], ['str', 58],
    ['prop', 44], ['str', 35],
    ['prop', 44], ['str', 30],
    ['plain', 10],
    null,
    ['kw', 48],
  ],
  skills: [
    ['cmt', 55],
    null,
    ['plain', 12],
    ['prop', 42], ['str', 40], ['str', 36], ['str', 30], ['str', 26], ['str', 22], ['str', 28], ['plain', 18],
    ['prop', 38], ['str', 30], ['str', 38], ['str', 34], ['str', 28], ['str', 42], ['str', 22], ['plain', 18],
    ['prop', 32], ['str', 44], ['str', 32], ['str', 42], ['plain', 18],
    ['prop', 34], ['str', 24], ['str', 56], ['str', 36], ['str', 40], ['str', 34], ['plain', 18],
    ['prop', 35], ['str', 26], ['str', 36], ['str', 34], ['str', 38], ['plain', 18],
    ['prop', 25], ['str', 38], ['str', 22], ['str', 18], ['str', 34], ['str', 42], ['str', 36], ['str', 40], ['str', 44], ['str', 22], ['plain', 18],
    ['prop', 28], ['str', 38], ['str', 30], ['str', 38], ['str', 30], ['str', 40], ['plain', 18],
    ['plain', 12],
  ],
  experience: [
    ['cmt', 60],
    null,
    ['kw', 52],
    // BRINC Drones
    ['plain', 10],
    ['prop', 42], ['str', 36],
    ['prop', 42], ['str', 60],
    ['prop', 42], ['str', 44],
    ['prop', 42], ['plain', 12],
    ['cmt', 75], ['cmt', 78],
    ['plain', 12], ['plain', 12],
    // AWS — Front End Engineer II
    ['plain', 10],
    ['prop', 42], ['str', 52],
    ['prop', 42], ['str', 34],
    ['prop', 42], ['str', 50],
    ['prop', 42], ['str', 44],
    ['prop', 42], ['plain', 12],
    ['cmt', 85], ['cmt', 68],
    ['plain', 12], ['plain', 12],
    // AWS — Front End Engineer
    ['plain', 10],
    ['prop', 42], ['str', 52],
    ['prop', 42], ['str', 44],
    ['prop', 42], ['str', 46],
    ['prop', 42], ['tp', 44],
    ['prop', 42], ['str', 46],
    ['prop', 42], ['plain', 12],
    ['cmt', 82], ['cmt', 72], ['cmt', 68],
    ['plain', 12], ['plain', 12],
    // Apple
    ['plain', 10],
    ['prop', 42], ['str', 30],
    ['prop', 42], ['str', 52],
    ['prop', 42], ['str', 42],
    ['prop', 42], ['plain', 12],
    ['cmt', 80], ['cmt', 64],
    ['plain', 12], ['plain', 10],
    // footer
    ['plain', 10],
    null,
    ['kw', 55],
  ],
  contact: [
    ['cmt', 55],
    null,
    ['kw', 42],
    ['prop', 45], ['str', 62],
    ['prop', 45], ['str', 42],
    ['prop', 45], ['str', 68],
    ['prop', 45], ['str', 55],
    ['plain', 15],
    null,
    ['kw', 55],
  ],
}

const COLORS: Record<string, string> = {
  kw:    'var(--kw)',
  str:   'var(--str)',
  prop:  'var(--prop)',
  cmt:   'var(--cmt)',
  tp:    'var(--tp)',
  plain: 'rgba(255,255,255,0.18)',
}

type Props = { active: Tab; scrollRatio: number }

const VIEWPORT_H = 72 // px, matches CSS

export function Minimap({ active, scrollRatio }: Props) {
  const lines = MAPS[active]
  if (!lines) return null

  // Total minimap content height: lines * (2px + 1.5px gap) + blanks * (5px + 1.5px gap)
  const totalH = lines.reduce((h, l) => h + (l === null ? 6.5 : 3.5), 0)
  const maxOffset = Math.max(0, totalH - VIEWPORT_H)
  const topOffset = scrollRatio * maxOffset

  return (
    <div className="minimap" aria-hidden="true">
      <div className="minimap-viewport" style={{ top: 10 + topOffset }} />
      {lines.map((line, i) =>
        line === null
          ? <div key={i} className="mm-blank" />
          : <div key={i} className="mm-line" style={{ width: `${line[1]}%`, background: COLORS[line[0]] }} />
      )}
    </div>
  )
}
