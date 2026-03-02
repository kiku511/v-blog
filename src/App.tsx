import { useState } from 'react'

type Tab = 'about' | 'skills' | 'contact'

const LANGS: Record<Tab, string> = {
  about: 'JavaScript',
  skills: 'JSON',
  contact: 'TypeScript',
}

// ── Syntax helpers ──────────────────────────────────────────
function Kw({ c }: { c: string }) {
  return <span className="kw">{c}</span>
}
function Prop({ c }: { c: string }) {
  return <span className="prop">{c}</span>
}
function Str({ c, href }: { c: string; href?: string }) {
  const text = `"${c}"`
  return href
    ? <a className="str" href={href} target="_blank" rel="noopener">{text}</a>
    : <span className="str">{text}</span>
}
function Cmt({ c }: { c: string }) {
  return <span className="cmt">{c}</span>
}
function Line({ n, children }: { n: number; children?: React.ReactNode }) {
  return (
    <div className="cl">
      <span className="ln">{n}</span>
      <span className="lc">{children}</span>
    </div>
  )
}

// ── Panels ───────────────────────────────────────────────────
function AboutPanel() {
  return (
    <>
      <Line n={1}><Cmt c="// about.js" /></Line>
      <Line n={2} />
      <Line n={3}><Kw c="const" /> <Prop c="vansh" /> {'= {'}</Line>
      <Line n={4}>{'  '}<Prop c="name" />{'     : '}<Str c="Vansh Gambhir" />{','}</Line>
      <Line n={5}>{'  '}<Prop c="role" />{'     : '}<Str c="Software Engineer (Frontend)" />{','}</Line>
      <Line n={6}>{'  '}<Prop c="company" />{'  : '}<Str c="BRINC Drones" />{','}</Line>
      <Line n={7}>{'  '}<Prop c="location" />{' : '}<Str c="Seattle, WA" />{','}</Line>
      <Line n={8}>{'  '}<Prop c="bio" />{'      : '}<Str c="Building fast, beautiful web experiences." /></Line>
      <Line n={9}>{'};'}</Line>
      <Line n={10} />
      <Line n={11}><Kw c="export default" /> <Prop c="vansh" />{'  ;'}</Line>
    </>
  )
}

function SkillsPanel() {
  return (
    <>
      <Line n={1}>{'{'}</Line>
      <Line n={2}>{'  '}<Prop c='"languages"' />{': ['}</Line>
      <Line n={3}>{'    '}<Str c="TypeScript" />{','}</Line>
      <Line n={4}>{'    '}<Str c="JavaScript" />{','}</Line>
      <Line n={5}>{'    '}<Str c="Python" />{','}</Line>
      <Line n={6}>{'    '}<Str c="Java" />{','}</Line>
      <Line n={7}>{'    '}<Str c="Go" />{','}</Line>
      <Line n={8}>{'    '}<Str c="Swift" /></Line>
      <Line n={9}>{'  ],'}</Line>
      <Line n={10}>{'  '}<Prop c='"frontend"' />{': ['}</Line>
      <Line n={11}>{'    '}<Str c="React" />{','}</Line>
      <Line n={12}>{'    '}<Str c="Node.js" />{','}</Line>
      <Line n={13}>{'    '}<Str c="Express" />{','}</Line>
      <Line n={14}>{'    '}<Str c="CSS" />{','}</Line>
      <Line n={15}>{'    '}<Str c="HTML" />{','}</Line>
      <Line n={16}>{'    '}<Str c="JSX" /></Line>
      <Line n={17}>{'  ],'}</Line>
      <Line n={18}>{'  '}<Prop c='"aws"' />{': ['}</Line>
      <Line n={19}>{'    '}<Str c="CloudFront" />{','}</Line>
      <Line n={20}>{'    '}<Str c="EC2" />{','}</Line>
      <Line n={21}>{'    '}<Str c="S3" />{','}</Line>
      <Line n={22}>{'    '}<Str c="Lambda" />{','}</Line>
      <Line n={23}>{'    '}<Str c="DynamoDB" />{','}</Line>
      <Line n={24}>{'    '}<Str c="AppSync" />{','}</Line>
      <Line n={25}>{'    '}<Str c="Bedrock" /></Line>
      <Line n={26}>{'  ],'}</Line>
      <Line n={27}>{'  '}<Prop c='"data"' />{': ['}</Line>
      <Line n={28}>{'    '}<Str c="Cassandra" />{','}</Line>
      <Line n={29}>{'    '}<Str c="MySQL" />{','}</Line>
      <Line n={30}>{'    '}<Str c="MongoDB" />{','}</Line>
      <Line n={31}>{'    '}<Str c="Pandas" /></Line>
      <Line n={32}>{'  ]'}</Line>
      <Line n={33}>{'}'}</Line>
    </>
  )
}

function ContactPanel() {
  return (
    <>
      <Line n={1}><Cmt c="// contact.ts" /></Line>
      <Line n={2} />
      <Line n={3}><Kw c="const" /> <Prop c="contact" /> {'= {'}</Line>
      <Line n={4}>{'  '}<Prop c="email" />{'   : '}<Str c="vansh.gambhir@gmail.com" href="mailto:vansh.gambhir@gmail.com" />{','}</Line>
      <Line n={5}>{'  '}<Prop c="website" />{' : '}<Str c="vansh.dev" href="https://vansh.dev" />{','}</Line>
      <Line n={6}>{'  '}<Prop c="linkedin" />{': '}<Str c="linkedin.com/in/vanshgambhir" href="https://www.linkedin.com/in/vanshgambhir/" />{','}</Line>
      <Line n={7}>{'  '}<Prop c="github" />{'  : '}<Str c="github.com/kiku511" href="https://github.com/kiku511" />{','}</Line>
      <Line n={8}>{'};'}</Line>
      <Line n={9} />
      <Line n={10}><Kw c="export default" /> <Prop c="contact" />{'  ;'}</Line>
    </>
  )
}

const PANELS: Record<Tab, React.ReactNode> = {
  about: <AboutPanel />,
  skills: <SkillsPanel />,
  contact: <ContactPanel />,
}

// ── File icons ───────────────────────────────────────────────
const FILE_COLOR: Record<Tab, string> = {
  about: '#e8bf6a',
  skills: '#519aba',
  contact: '#519aba',
}
const FILE_NAME: Record<Tab, string> = {
  about: 'about.js',
  skills: 'skills.json',
  contact: 'contact.ts',
}

function FileIcon({ tab }: { tab: Tab }) {
  return <div className="ficon" style={{ background: FILE_COLOR[tab] }} />
}

// ── Main App ─────────────────────────────────────────────────
export default function App() {
  const [active, setActive] = useState<Tab>('about')

  return (
    <div className="vscode">

      {/* Title bar */}
      <div className="titlebar">
        <div className="dots">
          <div className="dot r" />
          <div className="dot y" />
          <div className="dot g" />
        </div>
        vansh-gambhir — Visual Studio Code
      </div>

      <div className="main">

        {/* Activity bar */}
        <div className="activitybar">
          <div className="act-icon active">
            <svg width="22" height="22" viewBox="0 0 24 24" fill="currentColor">
              <path d="M3 3h8v2H5v14h14v-6h2v8H3V3zm11 0h7v7h-2V6.414l-9.293 9.293-1.414-1.414L17.586 5H14V3z"/>
            </svg>
          </div>
          <div className="act-icon">
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/>
            </svg>
          </div>
          <div className="act-icon">
            <svg width="22" height="22" viewBox="0 0 24 24" fill="currentColor">
              <path d="M12 2a5 5 0 1 0 0 10A5 5 0 0 0 12 2zm0 12c-5.33 0-8 2.67-8 4v2h16v-2c0-1.33-2.67-4-8-4z"/>
            </svg>
          </div>
          <div className="act-icon settings">
            <svg width="22" height="22" viewBox="0 0 24 24" fill="currentColor">
              <path d="M12 15.5A3.5 3.5 0 0 1 8.5 12 3.5 3.5 0 0 1 12 8.5a3.5 3.5 0 0 1 3.5 3.5 3.5 3.5 0 0 1-3.5 3.5m7.43-2.92c.04-.3.07-.62.07-.93s-.03-.64-.07-1l2.11-1.63c.19-.15.24-.42.12-.64l-2-3.46c-.12-.22-.39-.3-.61-.22l-2.49 1c-.52-.4-1.08-.73-1.69-.98l-.38-2.65C14.46 2.18 14.25 2 14 2h-4c-.25 0-.46.18-.49.42l-.38 2.65c-.61.25-1.17.59-1.69.98l-2.49-1c-.23-.09-.49 0-.61.22l-2 3.46c-.13.22-.07.49.12.64L4.57 11c-.04.36-.07.7-.07 1s.03.64.07 1l-2.11 1.66c-.19.15-.25.42-.12.64l2 3.46c.12.22.39.3.61.22l2.49-1.01c.52.4 1.08.73 1.69.98l.38 2.65c.03.24.24.42.49.42h4c.25 0 .46-.18.49-.42l.38-2.65c.61-.25 1.17-.58 1.69-.98l2.49 1.01c.22.08.49 0 .61-.22l2-3.46c.12-.22.07-.49-.12-.64l-2.11-1.66z"/>
            </svg>
          </div>
        </div>

        {/* Sidebar */}
        <div className="sidebar">
          <div className="sidebar-header">Explorer</div>
          <div className="tree-folder">▾ vansh-gambhir</div>
          <div className="tree-folder sub">▾ src</div>
          {(['about', 'skills', 'contact'] as Tab[]).map(tab => (
            <div
              key={tab}
              className={`tree-file${active === tab ? ' active' : ''}`}
              onClick={() => setActive(tab)}
            >
              <FileIcon tab={tab} />
              {FILE_NAME[tab]}
            </div>
          ))}
        </div>

        {/* Editor */}
        <div className="editor">
          <div className="tabs">
            {(['about', 'skills', 'contact'] as Tab[]).map(tab => (
              <div
                key={tab}
                className={`tab${active === tab ? ' active' : ''}`}
                onClick={() => setActive(tab)}
              >
                <FileIcon tab={tab} />
                {FILE_NAME[tab]}
              </div>
            ))}
          </div>
          <div className="panels">
            {PANELS[active]}
          </div>
        </div>

      </div>

      {/* Status bar */}
      <div className="statusbar">
        <div className="sb-left">
          <span>⎇ main</span>
          <span>🔴 0 &nbsp;⚠️ 0</span>
        </div>
        <div className="sb-right">
          <span>{LANGS[active]}</span>
          <span>UTF-8</span>
          <span>Ln 1, Col 1</span>
        </div>
      </div>

    </div>
  )
}
