import { FileIcon as Icon, defaultStyles } from 'react-file-icon'

type Props = { fileName: string }

export function FileIcon({ fileName }: Props) {
  const ext = fileName.split('.').pop() ?? ''
  return (
    <div style={{ width: 16, height: 16, flexShrink: 0 }}>
      <Icon extension={ext} {...(defaultStyles[ext as keyof typeof defaultStyles] ?? {})} />
    </div>
  )
}
