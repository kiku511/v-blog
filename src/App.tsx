import { useState, useEffect, useRef, useCallback } from 'react'
import { TABS, type Tab } from './config/tabs'
import { ActivityBar }    from './components/ActivityBar'
import { Sidebar }        from './components/Sidebar'
import { EditorTabs }     from './components/EditorTabs'
import { StatusBar }      from './components/StatusBar'
import { CommandPalette } from './components/CommandPalette'
import { ThemeSelector }  from './components/ThemeSelector'
import { CopilotPanel }  from './components/CopilotPanel'
import { useTheme }       from './hooks/useTheme'

export default function App() {
  const [active, setActive]           = useState<Tab>('about')
  const [cursor, setCursor]           = useState({ ln: 1, col: 1 })
  const [paletteOpen, setPalette]     = useState(false)
  const [themeOpen, setThemeOpen]     = useState(false)
  const [chatOpen, setChatOpen]       = useState(false)
  const [charWidth, setCharWidth]     = useState(8.4)
  const { themeId, setThemeId }       = useTheme()

  const activeRef      = useRef(active)
  const paletteOpenRef = useRef(false)
  useEffect(() => { activeRef.current = active },           [active])
  useEffect(() => { paletteOpenRef.current = paletteOpen }, [paletteOpen])

  // Measure actual character width once for accurate column numbers
  useEffect(() => {
    const canvas = document.createElement('canvas')
    const ctx = canvas.getContext('2d')
    if (!ctx) return
    ctx.font = '14px "Cascadia Code", "Fira Code", Consolas, monospace'
    setCharWidth(ctx.measureText('M').width)
  }, [])

  const selectTab = useCallback((tab: Tab) => {
    setActive(tab)
    setCursor({ ln: 1, col: 1 })
  }, [])

  // Global keyboard navigation
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      // ⌘P / ⌘⇧P — toggle command palette
      if ((e.metaKey || e.ctrlKey) && (e.key === 'p' || e.key === 'P')) {
        e.preventDefault()
        setPalette(o => !o)
        return
      }
      // Skip arrow-key nav when palette is open or an input is focused
      if (paletteOpenRef.current)                          return
      if (document.activeElement?.tagName === 'INPUT')     return

      const idx = TABS.findIndex(t => t.id === activeRef.current)
      if (e.key === 'ArrowRight') { e.preventDefault(); selectTab(TABS[(idx + 1) % TABS.length].id) }
      if (e.key === 'ArrowLeft')  { e.preventDefault(); selectTab(TABS[(idx - 1 + TABS.length) % TABS.length].id) }
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [selectTab])

  // Live Ln/Col tracking via event delegation
  const handleMouseMove = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
    const line = (e.target as HTMLElement).closest('.cl') as HTMLElement | null
    if (!line) return
    const lnEl = line.querySelector('.ln')
    const lcEl = line.querySelector('.lc') as HTMLElement | null
    if (!lnEl || !lcEl) return
    const ln  = parseInt(lnEl.textContent ?? '1', 10)
    const x   = Math.max(0, e.clientX - lcEl.getBoundingClientRect().left)
    const col = Math.floor(x / charWidth) + 1
    setCursor({ ln, col })
  }, [charWidth])

  const { Panel } = TABS.find(t => t.id === active)!

  return (
    <div className="vscode">

      <div className="titlebar">
        <div className="dots">
          <div className="dot r" />
          <div className="dot y" />
          <div className="dot g" />
        </div>
        vansh-gambhir — Code
        <div style={{ position: 'absolute', right: 12, display: 'flex', alignItems: 'center', gap: 8 }}>
          <button className="chat-mobile-btn" onClick={() => setChatOpen(o => !o)} title="AI Chat">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
              <path d="M20 2H4c-1.1 0-2 .9-2 2v18l4-4h14c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2zm-2 12H6v-2h12v2zm0-3H6V9h12v2zm0-3H6V6h12v2z"/>
            </svg>
          </button>
          <a
            href="/resume.pdf"
            download="Vansh-Gambhir-Resume.pdf"
            className="resume-btn"
            onClick={e => e.stopPropagation()}
          >
            ↓ Resume
          </a>
        </div>
      </div>

      <div className="main">
        <ActivityBar
          onThemeClick={() => setThemeOpen(true)}
        />
        <Sidebar active={active} onSelect={selectTab} />
        <div className="editor">
          <EditorTabs active={active} onSelect={selectTab} />
          <div className="panels" onMouseMove={handleMouseMove}>
            <Panel />
          </div>
        </div>
        <CopilotPanel isOpen={chatOpen} onClose={() => setChatOpen(false)} />
      </div>

      <StatusBar
        active={active}
        cursor={cursor}
        onOpenPalette={() => setPalette(true)}
        onOpenTheme={() => setThemeOpen(true)}
      />

      <CommandPalette
        isOpen={paletteOpen}
        onClose={() => setPalette(false)}
        onTabSelect={selectTab}
        onThemeSelect={() => setThemeOpen(true)}
      />

      <ThemeSelector
        isOpen={themeOpen}
        currentThemeId={themeId}
        onClose={() => setThemeOpen(false)}
        onSelect={setThemeId}
      />

    </div>
  )
}
