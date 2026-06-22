import { useEffect, useRef } from 'react'
import { useTheme } from '@mui/material'
import { TWallpaper, type TWallpaperHandlers, type PatternOptions } from '@twallpaper/react'
import '@twallpaper/react/css'
import patternUrl from '../assets/pattern.svg'

/**
 * Telegram-style animated wallpaper, powered by @twallpaper/react — the maintained
 * extraction of tweb's multicolor gradient renderer. The 4-colour gradient eases one
 * step forward on every sent message (dispatch `new Event('tg-send')`), same as tweb.
 *
 * - Light theme: the doodle pattern is overlaid on the gradient (mix-blend overlay).
 * - Dark theme: the doodle is used as a mask, so the bright gradient only shows
 *   through the line-art on top of the dark app background.
 *
 * The react wrapper only inits once (empty-deps effect), so colour/pattern updates on
 * theme toggle go through the imperative ref handlers, not the `options` prop.
 */

const SIZE = '420px'

function patternFor(mode: 'light' | 'dark', appBg: string): PatternOptions {
  return mode === 'dark'
    ? { image: patternUrl, mask: true, background: appBg, size: SIZE, opacity: 0.5 }
    : { image: patternUrl, mask: false, size: SIZE, opacity: 0.5 }
}

export default function ChatBackground() {
  const theme = useTheme()
  const tg = theme.tg
  const mode = theme.palette.mode
  const ref = useRef<TWallpaperHandlers>(null)

  // Re-apply colours + pattern through the imperative handlers whenever the theme
  // changes (the wrapper itself never re-inits from a new `options` prop).
  useEffect(() => {
    ref.current?.updateColors(tg.bgGradient)
    ref.current?.updatePattern(patternFor(mode, tg.appBg))
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [mode, tg.bgGradient.join(), tg.appBg])

  // Animate the gradient one step forward on each sent message.
  useEffect(() => {
    const onSend = () => ref.current?.toNextPosition()
    window.addEventListener('tg-send', onSend)
    return () => window.removeEventListener('tg-send', onSend)
  }, [])

  return (
    <TWallpaper
      ref={ref}
      options={{
        colors: tg.bgGradient,
        fps: 30,
        tails: 90,
        animate: false,
        pattern: patternFor(mode, tg.appBg),
      }}
      // sit behind the chat content (the library default is z-index:-1, which would
      // hide it under the app background box)
      style={{ zIndex: 0 }}
    />
  )
}
