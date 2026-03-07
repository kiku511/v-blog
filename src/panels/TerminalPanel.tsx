import { useState, useRef, useEffect, useCallback } from 'react'
import { ShellIcon } from '../components/Icons'
import { about, skills, experience, contact } from '../data/profile'

type Line = { id: string; kind: 'cmd' | 'out'; text: string; prompt?: true }

const PROMPT  = 'vansh@portfolio:~$'
const WELCOME = "Type 'help' to see available commands."

const CONTACT_LABELS: Record<string, string> = {
  email: 'Email', website: 'Web', linkedin: 'LinkedIn', github: 'GitHub',
}

const CAT_FILES: Record<string, string[]> = {
  'about.ts': [
    'const about = {',
    `  name:      "${about.name}",`,
    `  role:      "${about.role}",`,
    `  company:   "${about.company}",`,
    `  location:  "${about.location}",`,
    '  interests: ["bouldering", "skiing", "sci-fi", "pokémon"],',
    '  fav_movie: "Blade Runner",',
    '}',
  ],
  'skills.json': [
    '{',
    `  "languages": ${JSON.stringify(skills.languages)},`,
    `  "frontend":  ${JSON.stringify(skills.frontend)},`,
    `  "aws":       ${JSON.stringify(skills.aws)},`,
    `  "testing":   ${JSON.stringify(skills.testing)}`,
    '}',
  ],
  'experience.ts': [
    'const experience = [',
    ...experience.map((e, i) => {
      const co = e.team ? `${e.company} (${e.team})` : e.company
      return `  { company: "${co}", role: "${e.role}", period: "${e.period}" }${i < experience.length - 1 ? ',' : ''}`
    }),
    ']',
  ],
  'contact.ts': [
    'const contact = {',
    `  email:    "${contact.email.label}",`,
    `  website:  "${contact.website.label}",`,
    `  linkedin: "${contact.linkedin.label}",`,
    `  github:   "${contact.github.label}",`,
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

  useEffect(() => { inputRef.current?.focus() }, [])
  useEffect(() => { bottomRef.current?.scrollIntoView({ behavior: 'smooth' }) }, [lines])

  const onDragStart = useCallback((e: React.MouseEvent) => {
    dragging.current    = true
    startY.current      = e.clientY
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
          about.name,
          `${about.role} @ ${about.company} · ${about.location}`,
          "Prev: Amazon Web Services (5.5 yrs) · Apple (intern)",
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
        push(...Object.entries(skills).map(([k, v]) =>
          `${(k.charAt(0).toUpperCase() + k.slice(1)).padEnd(10)} ${v.join(' · ')}`
        ))
        break
      case 'experience':
        push(...experience.map(e => {
          const co = e.team ? `${e.company} (${e.team})` : e.company
          return `${e.period.padEnd(22)} ${co.padEnd(26)} ${e.role}`
        }))
        break
      case 'contact':
        push(...Object.entries(contact).map(([k, v]) =>
          `${(CONTACT_LABELS[k] ?? k).padEnd(9)} ${v.label}`
        ))
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
    } else if ((e.ctrlKey && e.key === 'l') || (e.metaKey && e.key === 'k')) {
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
            <ShellIcon style={{ flexShrink: 0 }} />
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
