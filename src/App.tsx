import { useState, useEffect, useCallback } from 'react'
import { TABS, type Tab } from './config/tabs'
import { ActivityBar } from './components/ActivityBar'
import { Sidebar } from './components/Sidebar'
import { EditorTabs } from './components/EditorTabs'
import { StatusBar } from './components/StatusBar'

export default function App() {
  const [active, setActive] = useState<Tab>('about')
  const [cursor, setCursor] = useState({ ln: 1, col: 1 })
  const [charWidth, setCharWidth] = useState(8.4)
  const { Panel } = TABS.find(t => t.id === active)!

  // Measure actual character width once for accurate column calculation
  useEffect(() => {
    const canvas = document.createElement('canvas')
    const ctx = canvas.getContext('2d')
    if (!ctx) return
    ctx.font = '14px "Cascadia Code", "Fira Code", Consolas, monospace'
    setCharWidth(ctx.measureText('M').width)
  }, [])

  const handleSelect = (tab: Tab) => {
    setActive(tab)
    setCursor({ ln: 1, col: 1 })
  }

  const handleMouseMove = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
    const line = (e.target as HTMLElement).closest('.cl') as HTMLElement | null
    if (!line) return
    const lnEl = line.querySelector('.ln')
    const lcEl = line.querySelector('.lc') as HTMLElement | null
    if (!lnEl || !lcEl) return
    const ln = parseInt(lnEl.textContent ?? '1', 10)
    const x = Math.max(0, e.clientX - lcEl.getBoundingClientRect().left)
    const col = Math.floor(x / charWidth) + 1
    setCursor({ ln, col })
  }, [charWidth])

  return (
    <div className="vscode">

      <div className="titlebar">
        <div className="dots">
          <div className="dot r" />
          <div className="dot y" />
          <div className="dot g" />
        </div>
        vansh-gambhir — Code
      </div>

      <div className="main">
        <ActivityBar />
        <Sidebar active={active} onSelect={handleSelect} />
        <div className="editor">
          <EditorTabs active={active} onSelect={handleSelect} />
          <div className="panels" onMouseMove={handleMouseMove}>
            <Panel />
          </div>
        </div>
      </div>

      <StatusBar active={active} cursor={cursor} />

    </div>
  )
}
