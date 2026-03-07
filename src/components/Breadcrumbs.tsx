import { TABS, type Tab } from '../config/tabs'

type Props = { active: Tab }

export function Breadcrumbs({ active }: Props) {
  const tab = TABS.find(t => t.id === active)!
  return (
    <div className="breadcrumbs">
      <span className="bc-item">vansh-gambhir</span>
      <span className="bc-sep">›</span>
      <span className="bc-item">src</span>
      <span className="bc-sep">›</span>
      <span className="bc-item bc-active">{tab.fileName}</span>
    </div>
  )
}
