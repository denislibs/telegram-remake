import { useEffect, useRef } from 'react'
import { Box, useTheme } from '@mui/material'

/**
 * Telegram-style animated wallpaper: a 4-colour gradient computed per-pixel on a
 * tiny canvas (cheap) and stretched to fill, plus the doodle pattern on top.
 * The 4 colour points ride an 8-position ring and shift one step on every sent
 * message (dispatch `new Event('tg-send')`), easing into place — same idea as
 * tweb's gradientRenderer.
 */

// 8-position ring (normalized), from tweb's gradientRenderer
const RING: [number, number][] = [
  [0.8, 0.1],
  [0.6, 0.2],
  [0.35, 0.25],
  [0.25, 0.6],
  [0.2, 0.9],
  [0.4, 0.8],
  [0.65, 0.75],
  [0.75, 0.4],
]
const W = 64
const H = 64

function hexToRgb(hex: string): [number, number, number] {
  const n = parseInt(hex.slice(1), 16)
  return [(n >> 16) & 255, (n >> 8) & 255, n & 255]
}
const lerp = (a: number, b: number, t: number) => a + (b - a) * t
const easeOut = (t: number) => 1 - Math.pow(1 - t, 3)

// the 4 active ring indices for a given base offset (each color sits 2 apart)
const activePoints = (base: number): [number, number][] =>
  [0, 2, 4, 6].map((o) => RING[(base + o) % 8])

export default function ChatBackground() {
  const theme = useTheme()
  const tg = theme.tg
  const mode = theme.palette.mode
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const baseRef = useRef(0) // current ring offset
  const rafRef = useRef(0)

  const colors = tg.bgGradient.map(hexToRgb)

  // Render the weighted-distance gradient for 4 normalized points
  const draw = (pts: [number, number][]) => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return
    const img = ctx.createImageData(W, H)
    const data = img.data
    for (let y = 0; y < H; y++) {
      for (let x = 0; x < W; x++) {
        const nx = x / (W - 1)
        const ny = y / (H - 1)
        let r = 0
        let g = 0
        let b = 0
        let wsum = 0
        for (let k = 0; k < 4; k++) {
          const dx = nx - pts[k][0]
          const dy = ny - pts[k][1]
          let d2 = dx * dx + dy * dy
          if (d2 < 1e-6) d2 = 1e-6
          const w = 1 / (d2 * d2) // 1 / distance^4 → soft, Telegram-like blobs
          r += colors[k][0] * w
          g += colors[k][1] * w
          b += colors[k][2] * w
          wsum += w
        }
        const i = (y * W + x) * 4
        data[i] = r / wsum
        data[i + 1] = g / wsum
        data[i + 2] = b / wsum
        data[i + 3] = 255
      }
    }
    ctx.putImageData(img, 0, 0)
  }

  // Redraw immediately whenever the palette (theme) changes — synchronous so it's
  // captured by the theme view-transition snapshot.
  useEffect(() => {
    draw(activePoints(baseRef.current))
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [tg.bgGradient.join()])

  // Animate the gradient one step forward on each sent message
  useEffect(() => {
    const onSend = () => {
      cancelAnimationFrame(rafRef.current)
      const from = activePoints(baseRef.current)
      const next = baseRef.current + 1
      const to = activePoints(next)
      const start = performance.now()
      const dur = 600
      const tick = (now: number) => {
        const t = Math.min(1, (now - start) / dur)
        const e = easeOut(t)
        const pts = from.map(
          (p, k) => [lerp(p[0], to[k][0], e), lerp(p[1], to[k][1], e)] as [number, number],
        )
        draw(pts)
        if (t < 1) rafRef.current = requestAnimationFrame(tick)
        else baseRef.current = next % 8
      }
      rafRef.current = requestAnimationFrame(tick)
    }
    window.addEventListener('tg-send', onSend)
    return () => {
      window.removeEventListener('tg-send', onSend)
      cancelAnimationFrame(rafRef.current)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [tg.bgGradient.join()])

  const isDark = mode === 'dark'

  return (
    <Box sx={{ position: 'fixed', inset: 0, zIndex: 0, overflow: 'hidden', pointerEvents: 'none' }}>
      {/* Dark base — the bright gradient only shows through the doodle mask */}
      {isDark && <Box sx={{ position: 'absolute', inset: 0, background: tg.appBg }} />}

      <canvas
        ref={canvasRef}
        width={W}
        height={H}
        style={{
          position: 'absolute',
          inset: 0,
          width: '100%',
          height: '100%',
          display: 'block',
          // tweb night: the doodle pattern masks the gradient -> faint coloured line-art on dark.
          // Keep it dim (low opacity) so it reads as subtle dark doodles, not a bright rainbow.
          ...(isDark
            ? {
                opacity: 0.3,
                WebkitMaskImage: tg.patternMask,
                maskImage: tg.patternMask,
                WebkitMaskSize: '400px',
                maskSize: '400px',
                WebkitMaskRepeat: 'repeat',
                maskRepeat: 'repeat',
              }
            : null),
        }}
      />

      {/* Light theme: full gradient + subtle soft-light doodles on top */}
      {!isDark && (
        <Box
          sx={{
            position: 'absolute',
            inset: 0,
            backgroundImage: tg.pattern,
            backgroundSize: '400px',
            mixBlendMode: 'soft-light',
            opacity: 0.5,
          }}
        />
      )}
    </Box>
  )
}
