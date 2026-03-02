import { useState } from 'react'
import { TABS, type Tab } from './config/tabs'
import { ActivityBar } from './components/ActivityBar'
import { Sidebar } from './components/Sidebar'
import { EditorTabs } from './components/EditorTabs'
import { StatusBar } from './components/StatusBar'

export default function App() {
  const [active, setActive] = useState<Tab>('about')
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
      </div>

      <div className="main">
        <ActivityBar />
        <Sidebar active={active} onSelect={setActive} />
        <div className="editor">
          <EditorTabs active={active} onSelect={setActive} />
          <div className="panels">
            <Panel />
          </div>
        </div>
      </div>

      <StatusBar active={active} />

    </div>
  )
}
