export const isMac  = /Mac|iPhone|iPod|iPad/.test(navigator.platform)
export const cmdKey = isMac ? 'Cmd' : 'Ctrl'
export const optKey = isMac ? 'Opt' : 'Alt'

export function measureMonospaceCharWidth(): number {
  const canvas = document.createElement('canvas')
  const ctx    = canvas.getContext('2d')
  if (!ctx) return 8.4
  ctx.font = '14px "Cascadia Code", "Fira Code", Consolas, monospace'
  return ctx.measureText('M').width
}
