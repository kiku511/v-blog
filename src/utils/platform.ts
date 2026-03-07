export const isMac  = /Mac|iPhone|iPod|iPad/.test(navigator.platform)
export const cmdKey = isMac ? 'Cmd' : 'Ctrl'
export const optKey = isMac ? 'Opt' : 'Alt'
