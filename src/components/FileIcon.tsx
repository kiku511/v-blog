const ICON_MAP: Record<string, { label: string; color: string }> = {
  ts:   { label: 'TS',  color: '#519aba' },
  json: { label: '{  }', color: '#cbcb41' },
  pdf:  { label: 'PDF', color: '#cc3e44' },
}

type Props = { fileName: string }

export function FileIcon({ fileName }: Props) {
  const ext   = fileName.split('.').pop() ?? ''
  const icon  = ICON_MAP[ext]
  if (!icon) return <span style={{ width: 20 }} />
  return (
    <span style={{
      color:      icon.color,
      fontWeight: 700,
      fontSize:   ext === 'pdf' ? '8px' : '9px',
      lineHeight: 1,
      flexShrink: 0,
      letterSpacing: '-0.3px',
      fontFamily: '-apple-system, "Helvetica Neue", sans-serif',
    }}>
      {icon.label}
    </span>
  )
}
