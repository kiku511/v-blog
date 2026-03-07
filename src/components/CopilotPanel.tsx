import { useState, useRef, useEffect, useCallback } from 'react'
import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'
import { ChatIcon, SendIcon } from './Icons'

type Message = { id: string; role: 'user' | 'assistant'; content: string }

const MIN_WIDTH = 220
const MAX_WIDTH = 560
const DEFAULT_WIDTH = 300

type Props = { isOpen: boolean; onClose: () => void }

// Characters typed per interval tick (every 20ms → ~100 chars/sec ≈ natural reading pace)
const CHARS_PER_TICK = 2
const TICK_MS        = 20

export function CopilotPanel({ isOpen, onClose }: Props) {
  const [messages, setMessages] = useState<Message[]>([])
  const [input, setInput]       = useState('')
  const [loading, setLoading]   = useState(false)
  const [width, setWidth]       = useState(DEFAULT_WIDTH)
  const bottomRef               = useRef<HTMLDivElement>(null)
  const inputRef                = useRef<HTMLTextAreaElement>(null)
  const dragging                = useRef(false)
  const startX                  = useRef(0)
  const startWidth              = useRef(DEFAULT_WIDTH)
  const charQueue               = useRef<string[]>([])
  const typeInterval            = useRef<ReturnType<typeof setInterval> | null>(null)
  const activeId                = useRef<string | null>(null)

  const stopTypewriter = () => {
    if (typeInterval.current) { clearInterval(typeInterval.current); typeInterval.current = null }
  }

  const startTypewriter = (id: string) => {
    stopTypewriter()
    activeId.current = id
    typeInterval.current = setInterval(() => {
      const batch = charQueue.current.splice(0, CHARS_PER_TICK).join('')
      if (!batch) return
      setMessages(m => m.map(msg => msg.id === id ? { ...msg, content: msg.content + batch } : msg))
    }, TICK_MS)
  }

  useEffect(() => () => stopTypewriter(), [])

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages, loading])

  useEffect(() => {
    if (isOpen) inputRef.current?.focus()
  }, [isOpen])

  useEffect(() => {
    const el = inputRef.current
    if (!el) return
    el.style.height = 'auto'
    el.style.height = el.scrollHeight + 'px'
  }, [input])

  const onDragStart = useCallback((e: React.MouseEvent) => {
    dragging.current  = true
    startX.current    = e.clientX
    startWidth.current = width
    e.preventDefault()
  }, [width])

  useEffect(() => {
    const onMove = (e: MouseEvent) => {
      if (!dragging.current) return
      const delta = startX.current - e.clientX
      setWidth(Math.min(MAX_WIDTH, Math.max(MIN_WIDTH, startWidth.current + delta)))
    }
    const onUp = () => { dragging.current = false }
    window.addEventListener('mousemove', onMove)
    window.addEventListener('mouseup', onUp)
    return () => {
      window.removeEventListener('mousemove', onMove)
      window.removeEventListener('mouseup', onUp)
    }
  }, [])

  const send = async () => {
    const text = input.trim()
    if (!text || loading) return

    const next: Message[] = [...messages, { id: crypto.randomUUID(), role: 'user', content: text }]
    setMessages(next)
    setInput('')
    if (inputRef.current) inputRef.current.style.height = 'auto'
    setLoading(true)

    try {
      const res = await fetch('/api/chat', {
        method:  'POST',
        headers: { 'Content-Type': 'application/json' },
        body:    JSON.stringify({ messages: next }),
      })
      if (!res.ok) {
        const data = await res.json() as { error?: string }
        throw new Error(data.error ?? `HTTP ${res.status}`)
      }

      const assistantId = crypto.randomUUID()
      const reader      = res.body!.getReader()
      const decoder     = new TextDecoder()
      let buffer        = ''
      let gotToken      = false

      charQueue.current = []

      while (true) {
        const { done, value } = await reader.read()
        if (done) break
        buffer += decoder.decode(value, { stream: true })
        const lines = buffer.split('\n')
        buffer = lines.pop()!
        for (const line of lines) {
          if (!line.startsWith('data: ')) continue
          const jsonStr = line.slice(6).trim()
          if (!jsonStr || jsonStr === '[DONE]') continue
          try {
            const { token } = JSON.parse(jsonStr) as { token?: string }
            if (token) {
              if (!gotToken) {
                gotToken = true
                setLoading(false)
                setMessages(m => [...m, { id: assistantId, role: 'assistant', content: '' }])
                startTypewriter(assistantId)
              }
              charQueue.current.push(...token.split(''))
            }
          } catch { /* skip malformed chunks */ }
        }
      }

      if (!gotToken) {
        setLoading(false)
        setMessages(m => [...m, { id: assistantId, role: 'assistant', content: 'Sorry, I could not generate a response.' }])
        return
      }

      // Wait for the typewriter to drain the queue, then stop
      const drain = setInterval(() => {
        if (charQueue.current.length === 0) { clearInterval(drain); stopTypewriter() }
      }, 50)
    } catch (err) {
      stopTypewriter()
      charQueue.current = []
      setLoading(false)
      const msg = err instanceof Error ? err.message : 'Network error. Please try again.'
      setMessages(m => [...m, { id: crypto.randomUUID(), role: 'assistant', content: msg }])
    }
  }

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); send() }
  }

  return (
    <div className={`copilot-panel${isOpen ? ' copilot-panel-open' : ''}`} style={{ width }}>
      <div className="copilot-resize-handle" onMouseDown={onDragStart} title="Drag to resize" />

      <div className="copilot-header">
        <span className="copilot-title">
          <ChatIcon style={{ flexShrink: 0 }} />
          AI Chat
        </span>
        <button className="copilot-close" onClick={onClose} aria-label="Close AI Chat">✕</button>
      </div>

      <div className="copilot-messages" aria-live="polite" aria-label="Chat messages">
        {messages.length === 0 && (
          <div className="copilot-welcome">
            <p>Hi! Ask me anything about <span className="kw">Vansh Gambhir</span>.</p>
            <div className="copilot-suggestions">
              {["What's Vansh's current role?", "What tech stack does he use?", "Where has he worked?"].map(s => (
                <button key={s} className="copilot-suggestion" onClick={() => { setInput(s); inputRef.current?.focus() }}>
                  {s}
                </button>
              ))}
            </div>
          </div>
        )}

        {messages.map(m => (
          <div key={m.id} className={`copilot-msg copilot-msg-${m.role}`}>
            <span className="copilot-msg-label">{m.role === 'user' ? 'You' : 'AI Chat'}</span>
            {m.role === 'assistant'
              ? <div className="copilot-msg-text copilot-md">
                  <ReactMarkdown remarkPlugins={[remarkGfm]}>{m.content}</ReactMarkdown>
                </div>
              : <p className="copilot-msg-text">{m.content}</p>
            }
          </div>
        ))}

        {loading && (
          <div className="copilot-msg copilot-msg-assistant">
            <span className="copilot-msg-label">AI Chat</span>
            <p className="copilot-msg-text copilot-typing">
              <span /><span /><span />
            </p>
          </div>
        )}

        <div ref={bottomRef} />
      </div>

      <div className="copilot-input-area">
        <div className="copilot-input-wrap">
          <textarea
            ref={inputRef}
            className="copilot-input"
            aria-label="Ask about Vansh"
            placeholder="Ask about Vansh..."
            value={input}
            rows={1}
            onChange={e => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
          />
          <button className="copilot-send" onClick={send} disabled={!input.trim() || loading} aria-label="Send message">
            <SendIcon />
          </button>
        </div>
      </div>
    </div>
  )
}
