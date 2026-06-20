import { createTheme, type Theme } from '@mui/material/styles'

export type Mode = 'light' | 'dark'

// Custom design tokens layered on top of the MUI theme.
interface TgTokens {
  accent: string
  accentGradient: string
  appBg: string
  sidebarBg: string
  bubble: string
  bubbleBorder: string
  hover: string
  selectedText: string
  divider: string
  textPrimary: string
  textSecondary: string
  textFaint: string
  link: string
  searchBg: string
  bannerBg: string
  badge: string
  pattern: string
  composeShadow: string
  menuBg: string
  menuShadow: string
  bgGradient: string[] // 4-point animated wallpaper gradient (tweb default)
}

declare module '@mui/material/styles' {
  interface Theme {
    tg: TgTokens
  }
  interface ThemeOptions {
    tg?: TgTokens
  }
}

// Subtle Telegram-style doodle pattern, encoded as an SVG data-uri.
const doodle = (stroke: string) =>
  `url("data:image/svg+xml,${encodeURIComponent(
    `<svg xmlns='http://www.w3.org/2000/svg' width='140' height='140' viewBox='0 0 140 140'>
      <g fill='none' stroke='${stroke}' stroke-width='1.4' stroke-linecap='round' stroke-linejoin='round' opacity='0.9'>
        <circle cx='24' cy='26' r='9'/>
        <path d='M18 26 l5 4 l8 -9'/>
        <path d='M70 18 l4 9 l9 1 l-7 6 l2 9 l-8 -5 l-8 5 l2 -9 l-7 -6 l9 -1 z'/>
        <path d='M112 24 c0 -6 8 -6 8 0 c0 -6 8 -6 8 0 c0 5 -8 10 -8 10 c0 0 -8 -5 -8 -10 z'/>
        <rect x='14' y='70' width='18' height='18' rx='4'/>
        <path d='M60 64 q12 4 0 24 q-12 -4 0 -24'/>
        <circle cx='118' cy='78' r='10'/>
        <path d='M113 78 h10 M118 73 v10'/>
        <path d='M20 112 c8 -10 18 -10 26 0'/>
        <path d='M74 108 l8 8 m0 -8 l-8 8'/>
        <path d='M108 112 q6 -12 14 0 q-6 12 -14 0'/>
      </g>
    </svg>`
  )}")`

// Values sampled from Telegram Web-K "Night" theme (.night palette)
const darkTokens: TgTokens = {
  accent: '#8774e1',
  accentGradient: 'linear-gradient(135deg, #8774e1 0%, #9a86ec 100%)',
  appBg: '#181818',
  sidebarBg: '#212121',
  bubble: '#212121',
  bubbleBorder: 'rgba(255,255,255,0.04)',
  hover: 'rgba(255,255,255,0.08)',
  selectedText: '#ffffff',
  divider: 'rgba(255,255,255,0.08)',
  textPrimary: '#ffffff',
  textSecondary: '#aaaaaa',
  textFaint: '#707579',
  link: '#8774e1',
  searchBg: '#2b2b2b',
  bannerBg: 'rgba(255,255,255,0.04)',
  badge: '#8774e1',
  pattern: doodle('rgba(140,120,225,0.06)'),
  composeShadow: '0 6px 22px rgba(135,116,225,0.5)',
  menuBg: 'rgba(30,30,30,0.8)',
  menuShadow: '0 12px 44px rgba(0,0,0,0.55)',
  bgGradient: ['#fec496', '#dd6cb9', '#962fbf', '#4f5bd5'], // tweb night wallpaper
}

const lightTokens: TgTokens = {
  accent: '#7d63e8',
  accentGradient: 'linear-gradient(135deg, #8a6cf0 0%, #a079f6 100%)',
  appBg: '#e7ddf5',
  sidebarBg: '#ffffff',
  bubble: '#ffffff',
  bubbleBorder: 'rgba(0,0,0,0.04)',
  hover: 'rgba(0,0,0,0.035)',
  selectedText: '#ffffff',
  divider: 'rgba(0,0,0,0.07)',
  textPrimary: '#1c1c1e',
  textSecondary: '#82868d',
  textFaint: '#a0a2a8',
  link: '#5b51d8',
  searchBg: 'rgba(0,0,0,0.045)',
  bannerBg: 'rgba(125,99,232,0.06)',
  badge: '#7d63e8',
  pattern: doodle('rgba(120,90,200,0.10)'),
  composeShadow: '0 6px 22px rgba(120,90,240,0.4)',
  menuBg: 'rgba(255,255,255,0.82)',
  menuShadow: '0 12px 44px rgba(80,60,160,0.20)',
  bgGradient: ['#dbddbb', '#6ba587', '#d5d88d', '#88b884'], // tweb day wallpaper
}

export function buildTheme(mode: Mode): Theme {
  const tg = mode === 'dark' ? darkTokens : lightTokens
  return createTheme({
    tg,
    palette: {
      mode,
      primary: { main: tg.accent },
      background: {
        default: tg.appBg,
        paper: tg.sidebarBg,
      },
      text: {
        primary: tg.textPrimary,
        secondary: tg.textSecondary,
      },
      divider: tg.divider,
    },
    shape: { borderRadius: 12 },
    typography: {
      fontFamily: 'Roboto, "Helvetica Neue", Arial, sans-serif',
      fontSize: 14,
    },
    components: {
      MuiCssBaseline: {
        styleOverrides: {
          '*::-webkit-scrollbar': { width: 6, height: 6 },
          '*::-webkit-scrollbar-thumb': {
            background: mode === 'dark' ? 'rgba(255,255,255,0.2)' : 'rgba(0,0,0,0.2)',
            borderRadius: 16,
          },
          '*::-webkit-scrollbar-track': { background: 'transparent' },
        },
      },
    },
  })
}
