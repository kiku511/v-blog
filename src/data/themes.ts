export type ThemeVars = {
  bg: string; sidebar: string; tabbar: string; 'titlebar-bg': string
  text: string; muted: string; accent: string
  kw: string; str: string; prop: string; nc: string; cmt: string; tp: string
  hover: string; sel: string
}

export type Theme = { id: string; name: string; vars: ThemeVars }

export const THEMES: Theme[] = [
  {
    id: 'dark-plus', name: 'Dark+ (Default)',
    vars: {
      bg: '#1e1e1e', sidebar: '#252526', tabbar: '#2d2d30', 'titlebar-bg': '#323233',
      text: '#d4d4d4', muted: '#9d9d9d', accent: '#007acc',
      kw: '#569cd6', str: '#ce9178', prop: '#9cdcfe', nc: '#b5cea8', cmt: '#6a9955', tp: '#4ec9b0',
      hover: '#2a2d2e', sel: '#37373d',
    },
  },
  {
    id: 'light-plus', name: 'Light+ (Default)',
    vars: {
      bg: '#ffffff', sidebar: '#f3f3f3', tabbar: '#ececec', 'titlebar-bg': '#dddddd',
      text: '#000000', muted: '#696969', accent: '#007acc',
      kw: '#0000ff', str: '#a31515', prop: '#001080', nc: '#098658', cmt: '#008000', tp: '#267f99',
      hover: '#e8e8e8', sel: '#d6ebff',
    },
  },
  {
    id: 'monokai', name: 'Monokai',
    vars: {
      bg: '#272822', sidebar: '#1e1f1c', tabbar: '#2d2e27', 'titlebar-bg': '#1a1b16',
      text: '#f8f8f2', muted: '#999080', accent: '#a6e22e',
      kw: '#f92672', str: '#e6db74', prop: '#a6e22e', nc: '#ae81ff', cmt: '#75715e', tp: '#66d9e8',
      hover: '#3a3b35', sel: '#49483e',
    },
  },
  {
    id: 'dracula', name: 'Dracula',
    vars: {
      bg: '#282a36', sidebar: '#21222c', tabbar: '#343746', 'titlebar-bg': '#191a21',
      text: '#f8f8f2', muted: '#8b9fc4', accent: '#bd93f9',
      kw: '#ff79c6', str: '#f1fa8c', prop: '#8be9fd', nc: '#bd93f9', cmt: '#6272a4', tp: '#50fa7b',
      hover: '#343746', sel: '#44475a',
    },
  },
  {
    id: 'nord', name: 'Nord',
    vars: {
      bg: '#2e3440', sidebar: '#3b4252', tabbar: '#434c5e', 'titlebar-bg': '#2e3440',
      text: '#d8dee9', muted: '#8fa0b5', accent: '#88c0d0',
      kw: '#81a1c1', str: '#a3be8c', prop: '#88c0d0', nc: '#b48ead', cmt: '#616e88', tp: '#8fbcbb',
      hover: '#434c5e', sel: '#4c566a',
    },
  },
  {
    id: 'github-dark', name: 'GitHub Dark',
    vars: {
      bg: '#0d1117', sidebar: '#161b22', tabbar: '#21262d', 'titlebar-bg': '#161b22',
      text: '#e6edf3', muted: '#8b949e', accent: '#1f6feb',
      kw: '#ff7b72', str: '#a5d6ff', prop: '#79c0ff', nc: '#79c0ff', cmt: '#8b949e', tp: '#ffa657',
      hover: '#21262d', sel: '#30363d',
    },
  },
  {
    id: 'solarized-dark', name: 'Solarized Dark',
    vars: {
      bg: '#002b36', sidebar: '#073642', tabbar: '#0a3749', 'titlebar-bg': '#00212b',
      text: '#839496', muted: '#586e75', accent: '#268bd2',
      kw: '#859900', str: '#2aa198', prop: '#268bd2', nc: '#d33682', cmt: '#586e75', tp: '#2aa198',
      hover: '#073642', sel: '#0d4a58',
    },
  },
  {
    id: 'solarized-light', name: 'Solarized Light',
    vars: {
      bg: '#fdf6e3', sidebar: '#eee8d5', tabbar: '#e0d9c6', 'titlebar-bg': '#d4cdb4',
      text: '#657b83', muted: '#93a1a1', accent: '#268bd2',
      kw: '#859900', str: '#2aa198', prop: '#268bd2', nc: '#d33682', cmt: '#93a1a1', tp: '#2aa198',
      hover: '#ece4cc', sel: '#ddd6c1',
    },
  },
]

export const DEFAULT_THEME_ID = 'dark-plus'
