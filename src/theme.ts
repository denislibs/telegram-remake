import { createTheme, type Theme } from '@mui/material/styles'
import patternUrl from './assets/pattern.svg'

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
  patternMask: string // solid-stroke doodle used as a CSS mask (gradient shows through)
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

// The real Telegram doodle pattern (bundled SVG); used both as the light overlay
// and as the dark-theme mask so the gradient shows through the doodle shapes.
const pattern = `url("${patternUrl}")`

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
  pattern,
  patternMask: pattern,
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
  pattern,
  patternMask: pattern,
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
