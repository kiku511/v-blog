import { useState, useRef, useEffect, useCallback } from 'react'

type Line = { id: string; kind: 'cmd' | 'out'; text: string; prompt?: true }

const PROMPT  = 'vansh@portfolio:~$'
const WELCOME = "Type 'help' to see available commands."

const CAT_FILES: Record<string, string[]> = {
  'about.ts': [
    'const about = {',
    '  name:      "Vansh Gambhir",',
    '  role:      "Software Engineer (Frontend)",',
    '  company:   "BRINC Drones",',
    '  location:  "Seattle, WA",',
    '  interests: ["bouldering", "skiing", "sci-fi", "pokémon"],',
    '  fav_movie: "Blade Runner",',
    '}',
  ],
  'skills.json': [
    '{',
    '  "languages": ["TypeScript", "JavaScript", "Python", "Go", "Swift"],',
    '  "frontend":  ["React", "Next.js", "GraphQL", "CSS"],',
    '  "aws":       ["Lambda", "DynamoDB", "Bedrock", "S3", "CloudFront"],',
    '  "testing":   ["Jest", "Cypress", "Playwright", "Vitest"]',
    '}',
  ],
  'experience.ts': [
    'const experience = [',
    '  { company: "BRINC Drones",   role: "SWE Frontend",  period: "Feb 2026 – Present" },',
    '  { company: "AWS GenAI",      role: "FEE II",         period: "Jan 2025 – Feb 2026" },',
    '  { company: "AWS App Studio", role: "FEE → FEE II",  period: "Jul 2020 – Jan 2025" },',
    '  { company: "Apple",          role: "SWE Intern",     period: "Jun 2019 – Sep 2019" },',
    ']',
  ],
  'contact.ts': [
    'const contact = {',
    '  email:    "vansh.gambhir@gmail.com",',
    '  website:  "vansh.dev",',
    '  linkedin: "linkedin.com/in/vanshgambhir",',
    '  github:   "github.com/kiku511",',
    '}',
  ],
  'resume.pdf': ['Binary file. Hint: click ↓ Resume in the title bar to download it.'],
}

type Props = { onClose: () => void; height: number; onResize: (h: number) => void }

const MIN_HEIGHT = 120
const MAX_HEIGHT = 600

export function TerminalPanel({ onClose, height, onResize }: Props) {
  const [lines, setLines] = useState<Line[]>([])
  const [input, setInput] = useState('')
  const [hist, setHist]   = useState<string[]>([])
  const histIdx           = useRef(-1)
  const inputRef          = useRef<HTMLInputElement>(null)
  const bottomRef         = useRef<HTMLDivElement>(null)
  const dragging          = useRef(false)
  const startY            = useRef(0)
  const startHeight       = useRef(height)

  useEffect(() => { bottomRef.current?.scrollIntoView({ behavior: 'smooth' }) }, [lines])

  const onDragStart = useCallback((e: React.MouseEvent) => {
    dragging.current   = true
    startY.current     = e.clientY
    startHeight.current = height
    e.preventDefault()
  }, [height])

  useEffect(() => {
    const onMove = (e: MouseEvent) => {
      if (!dragging.current) return
      const delta = startY.current - e.clientY
      onResize(Math.min(MAX_HEIGHT, Math.max(MIN_HEIGHT, startHeight.current + delta)))
    }
    const onUp = () => { dragging.current = false }
    window.addEventListener('mousemove', onMove)
    window.addEventListener('mouseup', onUp)
    return () => { window.removeEventListener('mousemove', onMove); window.removeEventListener('mouseup', onUp) }
  }, [onResize])

  const push = (...texts: string[]) =>
    setLines(l => [...l, ...texts.map(text => ({ id: crypto.randomUUID(), kind: 'out' as const, text }))])

  const run = (raw: string, currentHist: string[]) => {
    const cmd = raw.trim()
    if (!cmd) return
    setLines(l => [...l, { id: crypto.randomUUID(), kind: 'cmd', text: cmd, prompt: true }])
    setHist(h => [cmd, ...h])
    histIdx.current = -1

    const [c, ...args] = cmd.split(/\s+/)
    switch (c.toLowerCase()) {
      case 'help':
        push(
          'Available commands:',
          '',
          '  help              show available commands',
          '  whoami            who is Vansh?',
          '  ls                list portfolio files',
          '  cat <file>        read a file',
          '  pwd               print working directory',
          '  skills            tech stack',
          '  experience        work history',
          '  contact           contact info',
          '  clear             clear terminal',
          '  history           show command history',
          '',
          'Tip: ↑ / ↓ history · Ctrl+L / ⌘K to clear · Ctrl+` to toggle',
        )
        break
      case 'whoami':
        push(
          'Vansh Gambhir',
          'Software Engineer (Frontend) @ BRINC Drones · Seattle, WA',
          "Prev: Amazon Web Services (4.5 yrs) · Apple (intern)",
          "UW Dean's List · vansh.dev · github.com/kiku511",
        )
        break
      case 'pwd':   push('/home/vansh/portfolio'); break
      case 'ls':    push('about.ts  skills.json  experience.ts  contact.ts  resume.pdf'); break
      case 'cat':
        if (!args[0]) { push('cat: missing operand. Usage: cat <filename>'); break }
        if (CAT_FILES[args[0]]) { push(...CAT_FILES[args[0]]); break }
        push(`cat: ${args[0]}: No such file or directory`)
        break
      case 'skills':
        push(
          'Languages  TypeScript · JavaScript · Python · Java · Go · Swift',
          'Frontend   React · Next.js · Node.js · GraphQL · CSS',
          'State      Redux Toolkit · Zustand · React Query',
          'Testing    Jest · RTL · Cypress · Playwright · Vitest',
          'Tooling    Vite · Webpack · esbuild · Storybook',
          'AWS        Lambda · DynamoDB · Bedrock · S3 · CloudFront · AppSync',
          'Data       Cassandra · MySQL · MongoDB · Redshift · Pandas',
        )
        break
      case 'experience':
        push(
          'Feb 2026 – Present   BRINC Drones         Software Engineer (Frontend)',
          'Jan 2025 – Feb 2026  Amazon Web Services  Front End Engineer II (GenAI Agents)',
          'Jul 2020 – Jan 2025  Amazon Web Services  Front End Engineer (App Studio & QApps)',
          'Jun 2019 – Sep 2019  Apple, Inc.          Software Engineer Intern',
        )
        break
      case 'contact':
        push(
          'Email    vansh.gambhir@gmail.com',
          'Web      vansh.dev',
          'LinkedIn linkedin.com/in/vanshgambhir',
          'GitHub   github.com/kiku511',
        )
        break
      case 'clear':  setLines([]); break
      case 'history':
        if (currentHist.length === 0) { push('No history yet.'); break }
        push(...currentHist.slice().reverse().map((h, i) => `  ${i + 1}  ${h}`))
        break
      case 'sudo':  push('sudo: permission denied. (nice try 😄)'); break
      case 'rm':    push('rm: permission denied. this portfolio is staying right here.'); break
      case 'vim': case 'vi': case 'nano': case 'emacs':
        push(`${c}: you're trapped. type :q! to escape... just kidding, we're in a browser.`)
        break
      case 'git':
        if (args[0] === 'log') push(
          'commit a1b2c3d (HEAD -> main, origin/main)',
          'Author: Vansh Gambhir <vansh.gambhir@gmail.com>',
          'Date:   ' + new Date().toDateString(),
          '', '    feat: ship another banger ✨',
        )
        else if (args[0] === 'blame') push('All lines: Vansh Gambhir')
        else push(`git: try 'git log' or 'git blame'`)
        break
      case 'ssh':   push("ssh: connect to host vansh.dev port 22: no route to host (he's a frontend dev 😅)"); break
      case 'curl': case 'wget': push(`${c}: not a real server, but vansh.dev is! 🌐`); break
      case 'pokemon': case 'lucario':
        push('Lucario — Aura Pokémon  #448', 'Type: Fighting / Steel · Ability: Inner Focus', "Favorite Pokémon. Will talk about this at length. Don't start him. 🐾")
        break
      case 'echo':  push(args.join(' ') || ''); break
      case 'date':  push(new Date().toString()); break
      case 'uname': push('portfolio-v1 React19 arm64 TypeScript5.7'); break
      default:      push(`${c}: command not found. type 'help' to see available commands.`)
    }
  }

  const onKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      run(input, hist); setInput('')
    } else if (e.key === 'ArrowUp') {
      e.preventDefault()
      const next = Math.min(histIdx.current + 1, hist.length - 1)
      histIdx.current = next; setInput(hist[next] ?? '')
    } else if (e.key === 'ArrowDown') {
      e.preventDefault()
      const next = Math.max(histIdx.current - 1, -1)
      histIdx.current = next; setInput(next === -1 ? '' : (hist[next] ?? ''))
    } else if (e.ctrlKey && e.key === 'l' || e.metaKey && e.key === 'k') {
      e.preventDefault(); setLines([])
    } else if (e.ctrlKey && e.key === 'c') {
      e.preventDefault()
      setLines(l => [...l,
        { id: crypto.randomUUID(), kind: 'cmd', text: input, prompt: true },
        { id: crypto.randomUUID(), kind: 'out', text: '^C' },
      ])
      setInput(''); histIdx.current = -1
    }
  }

  return (
    <div className="terminal-bottom" style={{ height }}>
      <div className="terminal-resize-handle" onMouseDown={onDragStart} />

      <div className="terminal-header">
        <div className="terminal-header-tabs">
          <span className="terminal-panel-tab active">TERMINAL</span>
        </div>
        <div className="terminal-header-actions">
          <span className="terminal-shell-id">
            <svg width="11" height="11" viewBox="0 0 24 24" fill="currentColor" style={{ flexShrink: 0 }}>
              <path d="M20 4H4c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 14H4V8h16v10zm-9-1h2v-2h-2v2zm-4 0h2v-2H7v2zm8 0h2v-2h-2v2zM5 11.5l1.5-1.5L5 8.5 6.5 7 9 9.5 6.5 12 5 11.5z"/>
            </svg>
            zsh
          </span>
          <button className="terminal-header-close" onClick={onClose} title="Close Panel">✕</button>
        </div>
      </div>

      <div className="terminal-content" onClick={() => inputRef.current?.focus()}>
        <div className="term-line">
          <span className="term-out">{WELCOME}</span>
        </div>

        {lines.map(line => (
          <div key={line.id} className="term-line">
            {line.prompt && <span className="term-prompt">{PROMPT} </span>}
            <span className={line.kind === 'cmd' ? 'term-cmd' : 'term-out'}>{line.text}</span>
          </div>
        ))}

        <div className="term-line">
          <span className="term-prompt">{PROMPT} </span>
          <input
            ref={inputRef}
            className="term-input"
            value={input}
            onChange={e => setInput(e.target.value)}
            onKeyDown={onKeyDown}
            spellCheck={false}
            autoComplete="off"
            autoCapitalize="off"
            autoCorrect="off"
          />
        </div>
        <div ref={bottomRef} />
      </div>
    </div>
  )
}
