import { useState, useRef, useEffect, useCallback } from 'react'
import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'
import { ChatIcon, SendIcon } from './Icons'

type Message = { id: string; role: 'user' | 'assistant'; content: string }

const MIN_WIDTH = 220
const MAX_WIDTH = 560
const DEFAULT_WIDTH = 300

type Props = { isOpen: boolean; onClose: () => void }

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
      let fullContent   = ''
      let firstToken    = true

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
              fullContent += token
              if (firstToken) {
                firstToken = false
                setLoading(false)
                setMessages(m => [...m, { id: assistantId, role: 'assistant', content: fullContent }])
              } else {
                setMessages(m => m.map(msg => msg.id === assistantId ? { ...msg, content: fullContent } : msg))
              }
            }
          } catch { /* skip malformed chunks */ }
        }
      }

      if (firstToken) {
        // Stream ended with no tokens
        setLoading(false)
        setMessages(m => [...m, { id: assistantId, role: 'assistant', content: 'Sorry, I could not generate a response.' }])
      }
    } catch (err) {
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
