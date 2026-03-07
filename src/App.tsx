import { useState, useEffect, useRef, useCallback } from 'react'
import { TABS, type Tab } from './config/tabs'
import { ActivityBar }    from './components/ActivityBar'
import { Sidebar }        from './components/Sidebar'
import { EditorTabs }     from './components/EditorTabs'
import { StatusBar }      from './components/StatusBar'
import { CommandPalette } from './components/CommandPalette'
import { ThemeSelector }  from './components/ThemeSelector'
import { CopilotPanel }  from './components/CopilotPanel'
import { TerminalPanel } from './panels/TerminalPanel'
import { MatrixRain }   from './components/MatrixRain'
import { SearchPanel }  from './components/SearchPanel'
import { Minimap }      from './components/Minimap'
import { useTheme }            from './hooks/useTheme'
import { useMinimapSetting }  from './hooks/useMinimapSetting'
import { ChatIcon, HamburgerIcon, FileIcon as FileIconAct, SearchIcon, PersonIcon } from './components/Icons'

const KONAMI = ['ArrowUp','ArrowUp','ArrowDown','ArrowDown','ArrowLeft','ArrowRight','ArrowLeft','ArrowRight','b','a']

export default function App() {
  const [active, setActive]           = useState<Tab>('about')
  const [cursor, setCursor]           = useState({ ln: 1, col: 1 })
  const [paletteOpen, setPalette]     = useState(false)
  const [themeOpen, setThemeOpen]     = useState(false)
  const [chatOpen, setChatOpen]         = useState(() => window.innerWidth > 640)
  const [terminalOpen, setTerminalOpen] = useState(false)
  const [terminalHeight, setTerminalHeight] = useState(220)
  const [charWidth, setCharWidth]       = useState(8.4)
  const [matrixActive, setMatrixActive]   = useState(false)
  const [scrollRatio, setScrollRatio]     = useState(0)
  const panelContentRef                   = useRef<HTMLDivElement>(null)
  const [sidebarView, setSidebarView]     = useState<'explorer' | 'search'>('explorer')
  const [mobileNavOpen, setMobileNavOpen] = useState(false)
  const [sidebarWidth, setSidebarWidth]   = useState(220)
  const { themeId, setThemeId }           = useTheme()
  const { minimapOn, toggleMinimap }      = useMinimapSetting()

  const activeRef        = useRef(active)
  const paletteOpenRef   = useRef(false)
  const konamiIdx        = useRef(0)
  const sbDragging       = useRef(false)
  const sbStartX         = useRef(0)
  const sbStartWidth     = useRef(220)
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

  const onSidebarDragStart = useCallback((e: React.MouseEvent) => {
    sbDragging.current  = true
    sbStartX.current    = e.clientX
    sbStartWidth.current = sidebarWidth
    e.preventDefault()
  }, [sidebarWidth])

  useEffect(() => {
    const onMove = (e: MouseEvent) => {
      if (!sbDragging.current) return
      const delta = e.clientX - sbStartX.current
      setSidebarWidth(Math.min(400, Math.max(140, sbStartWidth.current + delta)))
    }
    const onUp = () => { sbDragging.current = false }
    window.addEventListener('mousemove', onMove)
    window.addEventListener('mouseup', onUp)
    return () => { window.removeEventListener('mousemove', onMove); window.removeEventListener('mouseup', onUp) }
  }, [])

  const selectTab = useCallback((tab: Tab) => {
    setActive(tab)
    setCursor({ ln: 1, col: 1 })
    setScrollRatio(0)
    setMobileNavOpen(false)
    if (panelContentRef.current) panelContentRef.current.scrollTop = 0
  }, [])

  // Global keyboard navigation
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      // Konami code: ↑↑↓↓←→←→BA
      if (e.key === KONAMI[konamiIdx.current]) {
        konamiIdx.current++
        if (konamiIdx.current === KONAMI.length) {
          konamiIdx.current = 0
          setMatrixActive(true)
        }
      } else {
        konamiIdx.current = e.key === KONAMI[0] ? 1 : 0
      }

      // ⌘P / ⌘⇧P — toggle command palette
      if ((e.metaKey || e.ctrlKey) && (e.key === 'p' || e.key === 'P')) {
        e.preventDefault()
        setPalette(o => !o)
        return
      }
      // Ctrl+` — toggle terminal (same on Mac and Windows, Cmd+` is reserved by macOS)
      if (e.ctrlKey && e.key === '`') {
        e.preventDefault()
        setTerminalOpen(o => !o)
        return
      }
      // Cmd+Opt+T / Ctrl+Alt+T — change color theme
      if ((e.metaKey || e.ctrlKey) && e.altKey && e.key === 't') {
        e.preventDefault()
        setThemeOpen(o => !o)
        return
      }
      // Cmd+Opt+M / Ctrl+Alt+M — toggle minimap
      if ((e.metaKey || e.ctrlKey) && e.altKey && e.key === 'm') {
        e.preventDefault()
        toggleMinimap()
        return
      }
      // Cmd+Opt+A / Ctrl+Alt+A — toggle AI chat
      if ((e.metaKey || e.ctrlKey) && e.altKey && e.key === 'a') {
        e.preventDefault()
        setChatOpen(o => !o)
        return
      }
      // Skip arrow-key nav when palette is open or an input is focused
      if (paletteOpenRef.current)                          return
      if (document.activeElement?.tagName === 'INPUT')     return

      if (!(e.metaKey || e.ctrlKey)) return
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

      <header className="titlebar">
        <div className="dots" aria-hidden="true">
          <div className="dot r" />
          <div className="dot y" />
          <div className="dot g" />
        </div>
        <button
          className="hamburger-btn"
          onClick={() => setMobileNavOpen(o => !o)}
          aria-label="Open navigation"
          aria-expanded={mobileNavOpen}
        >
          <HamburgerIcon />
        </button>
        <span aria-hidden="true">vansh-gambhir — Code</span>
        <div style={{ position: 'absolute', right: 12, display: 'flex', alignItems: 'center', gap: 8 }}>
          <button className="chat-mobile-btn" onClick={() => setChatOpen(o => !o)} aria-label="Toggle AI Chat">
            <ChatIcon />
          </button>
          <a
            href="/resume.pdf"
            download="Vansh-Gambhir-Resume.pdf"
            className="resume-btn"
            aria-label="Download resume PDF"
            onClick={e => e.stopPropagation()}
          >
            ↓ Resume
          </a>
        </div>
      </header>

      <main className="main">
        <ActivityBar
          sidebarView={sidebarView}
          onSidebarView={setSidebarView}
          onPaletteClick={() => setPalette(true)}
        />
        <div className="sidebar-resizable" style={{ width: sidebarWidth }}>
          <div className="sidebar-resize-handle" onMouseDown={onSidebarDragStart} />
          {sidebarView === 'search'
            ? <SearchPanel onNavigate={tab => { selectTab(tab); setSidebarView('explorer') }} />
            : <Sidebar active={active} onSelect={selectTab} />
          }
        </div>
        <div className="editor">
          <EditorTabs active={active} onSelect={selectTab} />
          <div className="panels" onMouseMove={handleMouseMove}>
            <div
              className="panel-content"
              ref={panelContentRef}
              onScroll={e => {
                const el = e.currentTarget
                const ratio = el.scrollHeight === el.clientHeight ? 0
                  : el.scrollTop / (el.scrollHeight - el.clientHeight)
                setScrollRatio(ratio)
              }}
            >
              <Panel />
            </div>
            {minimapOn && <Minimap active={active} scrollRatio={scrollRatio} />}
          </div>
          {terminalOpen && (
            <TerminalPanel
              onClose={() => setTerminalOpen(false)}
              height={terminalHeight}
              onResize={setTerminalHeight}
            />
          )}
        </div>
        <CopilotPanel isOpen={chatOpen} onClose={() => setChatOpen(false)} />
      </main>

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
        onTerminalToggle={() => setTerminalOpen(o => !o)}
        onMinimapToggle={toggleMinimap}
        minimapOn={minimapOn}
      />

      <ThemeSelector
        isOpen={themeOpen}
        currentThemeId={themeId}
        onClose={() => setThemeOpen(false)}
        onSelect={setThemeId}
      />

      {matrixActive && <MatrixRain onDone={() => setMatrixActive(false)} />}

      {/* Mobile slide-in navigation drawer */}
      {mobileNavOpen && (
        <div className="mobile-backdrop" onClick={() => setMobileNavOpen(false)} aria-hidden="true" />
      )}
      <nav className={`mobile-drawer${mobileNavOpen ? ' open' : ''}`} aria-label="Navigation" aria-hidden={!mobileNavOpen}>
        <div className="mobile-drawer-bar">
          <button
            className={`act-icon${sidebarView === 'explorer' ? ' active' : ''}`}
            onClick={() => setSidebarView('explorer')}
            aria-label="Explorer"
            aria-pressed={sidebarView === 'explorer'}
          >
            <FileIconAct aria-hidden="true" />
          </button>
          <button
            className={`act-icon${sidebarView === 'search' ? ' active' : ''}`}
            onClick={() => setSidebarView('search')}
            aria-label="Search"
            aria-pressed={sidebarView === 'search'}
          >
            <SearchIcon aria-hidden="true" />
          </button>
          <a
            className="act-icon"
            href="https://www.linkedin.com/in/vanshgambhir/"
            target="_blank"
            rel="noreferrer"
            aria-label="LinkedIn profile (opens in new tab)"
          >
            <PersonIcon aria-hidden="true" />
          </a>
        </div>
        <div className="mobile-drawer-content">
          {sidebarView === 'search'
            ? <SearchPanel onNavigate={tab => { selectTab(tab); setSidebarView('explorer') }} />
            : <Sidebar active={active} onSelect={selectTab} />
          }
        </div>
      </nav>

    </div>
  )
}
