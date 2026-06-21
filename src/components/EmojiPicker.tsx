import { useEffect, useMemo, useRef, useState } from 'react'
import { Box, InputBase, Typography, useTheme } from '@mui/material'
import { AnimatePresence, motion } from 'framer-motion'
import SearchRounded from '@mui/icons-material/SearchRounded'
import BackspaceOutlined from '@mui/icons-material/BackspaceOutlined'
import HistoryRounded from '@mui/icons-material/HistoryRounded'
import SentimentSatisfiedAltRounded from '@mui/icons-material/SentimentSatisfiedAltRounded'
import PetsRounded from '@mui/icons-material/PetsRounded'
import FastfoodRounded from '@mui/icons-material/FastfoodRounded'
import SportsBasketballRounded from '@mui/icons-material/SportsBasketballRounded'
import DirectionsCarFilledRounded from '@mui/icons-material/DirectionsCarFilledRounded'
import LightbulbRounded from '@mui/icons-material/LightbulbRounded'
import EmojiSymbolsRounded from '@mui/icons-material/EmojiSymbolsRounded'
import FlagRounded from '@mui/icons-material/FlagRounded'
import AutoAwesomeOutlined from '@mui/icons-material/AutoAwesomeOutlined'
import GifBoxOutlined from '@mui/icons-material/GifBoxOutlined'
import { EASE } from '../motion'
import { useT } from '../i18n'
import { CATEGORIES, SKIN, TONES, NAMES } from './emoji/emojiData'

type Tab = 'emoji' | 'stickers' | 'gifs'

const CAT_ICON: Record<string, typeof PetsRounded> = {
  recent: HistoryRounded,
  smileys: SentimentSatisfiedAltRounded,
  animals: PetsRounded,
  food: FastfoodRounded,
  activity: SportsBasketballRounded,
  travel: DirectionsCarFilledRounded,
  objects: LightbulbRounded,
  symbols: EmojiSymbolsRounded,
  flags: FlagRounded,
}

const RECENT_KEY = 'tg-emoji-recent'
function loadRecent(): string[] {
  try {
    return JSON.parse(localStorage.getItem(RECENT_KEY) || '[]')
  } catch {
    return []
  }
}

// mock sticker packs (emoji placeholders) + mock GIF gradients
const STICKER_PACKS = [
  { name: 'Cats', emojis: ['😺', '😸', '😹', '😻', '😼', '😽', '🙀', '😿', '😾', '🐱', '🐈', '🐈‍⬛'] },
  { name: 'Hands', emojis: ['👍', '👎', '👏', '🙌', '🤝', '✌️', '🤟', '🤙', '👊', '✊', '🤛', '🤜'] },
  { name: 'Party', emojis: ['🎉', '🎊', '🥳', '🎂', '🎈', '🎁', '🍾', '🥂', '✨', '💫', '🪅', '🎆'] },
  { name: 'Love', emojis: ['❤️', '🧡', '💛', '💚', '💙', '💜', '🖤', '💕', '💞', '💓', '💗', '💖'] },
]
const GIF_TILES = [
  { g: 'linear-gradient(135deg,#ff6a88,#ff99ac)', h: 100, e: '🐱' },
  { g: 'linear-gradient(135deg,#43cea2,#185a9d)', h: 150, e: '🌊' },
  { g: 'linear-gradient(135deg,#f7971e,#ffd200)', h: 120, e: '😂' },
  { g: 'linear-gradient(135deg,#654ea3,#eaafc8)', h: 140, e: '🎉' },
  { g: 'linear-gradient(135deg,#8a5bff,#5b8dff)', h: 110, e: '🔥' },
  { g: 'linear-gradient(135deg,#2980b9,#6dd5fa)', h: 160, e: '👍' },
  { g: 'linear-gradient(135deg,#ee9ca7,#ffdde1)', h: 130, e: '🥰' },
  { g: 'linear-gradient(135deg,#c471f5,#fa71cd)', h: 120, e: '💃' },
  { g: 'linear-gradient(135deg,#42e695,#3bb2b8)', h: 150, e: '🤩' },
  { g: 'linear-gradient(135deg,#f7971e,#ffd200)', h: 100, e: '🎬' },
]

export default function EmojiPicker({
  onPick,
  onSticker,
  onGif,
  onClose,
}: {
  onPick: (emoji: string) => void
  onSticker?: (emoji: string) => void
  onGif?: (gradient: string) => void
  onClose: () => void
}) {
  const tg = useTheme().tg
  const t = useT()
  const [tab, setTab] = useState<Tab>('emoji')
  const [search, setSearch] = useState(false)
  const [query, setQuery] = useState('')
  const [tone, setTone] = useState(0)
  const [toneOpen, setToneOpen] = useState(false)
  const [recent, setRecent] = useState<string[]>(loadRecent)
  const [activeCat, setActiveCat] = useState('smileys')

  const scrollRef = useRef<HTMLDivElement>(null)
  const sectionRefs = useRef<Record<string, HTMLDivElement | null>>({})

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && onClose()
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [onClose])

  const applyTone = (e: string) => (tone > 0 && SKIN.has(e) ? e + TONES[tone] : e)

  const pickEmoji = (e: string) => {
    const base = e // store the toned version in recent as-is
    onPick(base)
    setRecent((prev) => {
      const next = [base, ...prev.filter((x) => x !== base)].slice(0, 32)
      localStorage.setItem(RECENT_KEY, JSON.stringify(next))
      return next
    })
  }

  // categories incl. Recent when present
  const cats = useMemo(
    () => (recent.length ? [{ key: 'recent', label: 'Recently Used', emojis: recent }, ...CATEGORIES] : CATEGORIES),
    [recent],
  )

  // search results
  const results = useMemo(() => {
    const q = query.trim().toLowerCase()
    if (!q) return []
    const out: string[] = []
    for (const c of CATEGORIES)
      for (const e of c.emojis) {
        const kw = NAMES[e]
        if ((kw && kw.includes(q)) || e === q) out.push(e)
      }
    return out
  }, [query])

  // scroll-spy for the category nav
  const onScroll = () => {
    const sc = scrollRef.current
    if (!sc) return
    const top = sc.scrollTop + 8
    let cur = cats[0]?.key
    for (const c of cats) {
      const el = sectionRefs.current[c.key]
      if (el && el.offsetTop <= top) cur = c.key
    }
    if (cur) setActiveCat(cur)
  }
  const scrollToCat = (key: string) => {
    const el = sectionRefs.current[key]
    const sc = scrollRef.current
    if (el && sc) sc.scrollTo({ top: el.offsetTop - 2, behavior: 'smooth' })
    setActiveCat(key)
  }

  const cellSx = {
    width: 42,
    height: 42,
    fontSize: 28,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: '8px',
    cursor: 'pointer',
    userSelect: 'none' as const,
    transition: 'background .12s',
    '&:hover': { background: tg.hover },
    '&:active': { background: tg.divider },
  }

  const tabBtn = (key: Tab | 'search' | 'delete', icon: React.ReactNode) => {
    const active = (key === 'search' && search) || key === tab
    return (
      <Box
        key={key}
        onClick={() => {
          if (key === 'search') {
            setSearch((s) => !s)
            setTab('emoji')
          } else if (key === 'delete') {
            onPick('\b') // signals a backspace to the composer
          } else {
            setSearch(false)
            setTab(key)
          }
        }}
        sx={{
          width: 40,
          height: 36,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          borderRadius: '8px',
          cursor: 'pointer',
          color: active ? tg.accent : tg.textSecondary,
          background: active ? `${tg.accent}1f` : 'transparent',
          '&:hover': { background: active ? `${tg.accent}1f` : tg.hover },
        }}
      >
        {icon}
      </Box>
    )
  }

  return (
    <Box
      component={motion.div}
      initial={{ opacity: 0, scale: 0.85 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.85 }}
      transition={{ duration: 0.2, ease: EASE }}
      sx={{
        position: 'absolute',
        bottom: 'calc(100% + 8px)',
        right: 0,
        width: 'min(382px, calc(100vw - 24px))',
        height: 420,
        background: tg.menuBg,
        backdropFilter: 'blur(40px)',
        WebkitBackdropFilter: 'blur(40px)',
        borderRadius: '20px',
        boxShadow: '0 5px 10px 5px rgba(16,35,47,0.14)',
        overflow: 'hidden',
        display: 'flex',
        flexDirection: 'column',
        transformOrigin: 'bottom right',
        zIndex: 30,
      }}
    >
      {/* Top: search field+chips OR category nav (emoji tab only) */}
      {search ? (
        <Box sx={{ p: 1, borderBottom: `1px solid ${tg.divider}` }}>
          <Box
            sx={{
              display: 'flex',
              alignItems: 'center',
              gap: 1,
              height: 38,
              px: 1.5,
              borderRadius: '8px',
              background: tg.bubble,
            }}
          >
            <SearchRounded sx={{ fontSize: 20, color: tg.textFaint }} />
            <InputBase
              autoFocus
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder={t('Search Emoji')}
              sx={{ flex: 1, fontSize: 15, color: tg.textPrimary, '& input::placeholder': { color: tg.textFaint, opacity: 1 } }}
            />
          </Box>
          <Box sx={{ display: 'flex', gap: '7px', mt: 1, overflowX: 'auto', '&::-webkit-scrollbar': { display: 'none' } }}>
            {CATEGORIES.map((c) => {
              const Icon = CAT_ICON[c.key]
              return (
                <Box
                  key={c.key}
                  onClick={() => {
                    setSearch(false)
                    setQuery('')
                    scrollToCat(c.key)
                  }}
                  sx={{
                    width: 28,
                    height: 28,
                    flexShrink: 0,
                    borderRadius: '50%',
                    background: tg.bubble,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: tg.textSecondary,
                    cursor: 'pointer',
                    '&:hover': { background: tg.hover },
                  }}
                >
                  <Icon sx={{ fontSize: 18 }} />
                </Box>
              )
            })}
          </Box>
        </Box>
      ) : (
        tab === 'emoji' && (
          <Box
            sx={{
              position: 'relative',
              display: 'flex',
              alignItems: 'center',
              gap: 0.25,
              px: 0.5,
              height: 40,
              borderBottom: `1px solid ${tg.divider}`,
            }}
          >
            <Box sx={{ display: 'flex', flex: 1, overflowX: 'auto', '&::-webkit-scrollbar': { display: 'none' } }}>
              {cats.map((c) => {
                const Icon = CAT_ICON[c.key]
                const on = activeCat === c.key
                return (
                  <Box
                    key={c.key}
                    onClick={() => scrollToCat(c.key)}
                    sx={{
                      width: 32,
                      height: 32,
                      flexShrink: 0,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      borderRadius: '8px',
                      cursor: 'pointer',
                      color: on ? tg.accent : tg.textFaint,
                      '&:hover': { color: tg.textSecondary },
                    }}
                  >
                    <Icon sx={{ fontSize: 20 }} />
                  </Box>
                )
              })}
            </Box>
            {/* skin-tone selector */}
            <Box sx={{ position: 'relative', flexShrink: 0 }}>
              <Box
                onClick={() => setToneOpen((o) => !o)}
                sx={{ width: 32, height: 32, fontSize: 20, display: 'flex', alignItems: 'center', justifyContent: 'center', borderRadius: '8px', cursor: 'pointer', '&:hover': { background: tg.hover } }}
              >
                {'✋' + TONES[tone]}
              </Box>
              <AnimatePresence>
                {toneOpen && (
                  <Box
                    component={motion.div}
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.9 }}
                    transition={{ duration: 0.15, ease: EASE }}
                    sx={{
                      position: 'absolute',
                      top: '100%',
                      right: 0,
                      mt: 0.5,
                      display: 'flex',
                      gap: 0.25,
                      p: 0.5,
                      borderRadius: '8px',
                      background: tg.menuBg,
                      boxShadow: tg.menuShadow,
                      zIndex: 5,
                    }}
                  >
                    {TONES.map((tn, i) => (
                      <Box
                        key={i}
                        onClick={() => {
                          setTone(i)
                          setToneOpen(false)
                        }}
                        sx={{ width: 30, height: 30, fontSize: 20, display: 'flex', alignItems: 'center', justifyContent: 'center', borderRadius: '6px', cursor: 'pointer', '&:hover': { background: tg.hover } }}
                      >
                        {'✋' + tn}
                      </Box>
                    ))}
                  </Box>
                )}
              </AnimatePresence>
            </Box>
          </Box>
        )
      )}

      {/* Content */}
      <Box ref={scrollRef} onScroll={onScroll} sx={{ flex: 1, overflowY: 'auto', overflowX: 'hidden', px: 0.5, py: 0.5 }}>
        {/* SEARCH RESULTS */}
        {search && query.trim() ? (
          results.length ? (
            <Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, 42px)', justifyContent: 'space-between' }}>
              {results.map((e, i) => (
                <Box key={`${e}-${i}`} onClick={() => pickEmoji(e)} sx={cellSx}>
                  {e}
                </Box>
              ))}
            </Box>
          ) : (
            <Typography sx={{ textAlign: 'center', color: tg.textSecondary, fontSize: 14, mt: 4 }}>
              {t('No emoji found.')}
            </Typography>
          )
        ) : tab === 'emoji' ? (
          cats.map((c) => (
            <Box key={c.key} ref={(el: HTMLDivElement | null) => (sectionRefs.current[c.key] = el)} sx={{ mb: 0.5 }}>
              <Typography sx={{ fontSize: 13, fontWeight: 500, color: tg.textFaint, px: '6px', py: '6px' }}>
                {t(c.label)}
              </Typography>
              <Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, 42px)', justifyContent: 'space-between' }}>
                {c.emojis.map((e, i) => {
                  const toned = c.key === 'recent' ? e : applyTone(e)
                  return (
                    <Box key={`${c.key}-${i}`} onClick={() => pickEmoji(toned)} sx={cellSx}>
                      {toned}
                    </Box>
                  )
                })}
              </Box>
            </Box>
          ))
        ) : tab === 'stickers' ? (
          STICKER_PACKS.map((p) => (
            <Box key={p.name} sx={{ mb: 0.5 }}>
              <Typography sx={{ fontSize: 13, fontWeight: 500, color: tg.textFaint, px: '6px', py: '6px' }}>
                {p.name}
              </Typography>
              <Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, 64px)', justifyContent: 'space-between', gap: '4px' }}>
                {p.emojis.map((e, i) => (
                  <Box
                    key={`${p.name}-${i}`}
                    onClick={() => {
                      onSticker?.(e)
                      onClose()
                    }}
                    sx={{ width: 64, height: 64, fontSize: 46, display: 'flex', alignItems: 'center', justifyContent: 'center', borderRadius: '10px', cursor: 'pointer', '&:hover': { background: tg.hover } }}
                  >
                    {e}
                  </Box>
                ))}
              </Box>
            </Box>
          ))
        ) : (
          // GIFs — masonry via CSS columns
          <Box sx={{ columnCount: 2, columnGap: '2px', px: '2px' }}>
            {GIF_TILES.map((tile, i) => (
              <Box
                key={i}
                onClick={() => {
                  onGif?.(tile.g)
                  onClose()
                }}
                sx={{
                  breakInside: 'avoid',
                  mb: '2px',
                  height: tile.h,
                  borderRadius: '8px',
                  background: tile.g,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: 40,
                  cursor: 'pointer',
                  position: 'relative',
                  '&::after': { content: '""', position: 'absolute', inset: 0, borderRadius: '8px', background: 'rgba(0,0,0,0.06)', opacity: 0, transition: 'opacity .15s' },
                  '&:hover::after': { opacity: 1 },
                }}
              >
                {tile.e}
              </Box>
            ))}
          </Box>
        )}
      </Box>

      {/* Bottom tab bar */}
      <Box
        sx={{
          height: 49,
          flexShrink: 0,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          gap: 0.5,
          position: 'relative',
          borderTop: `1px solid ${tg.divider}`,
        }}
      >
        <Box sx={{ position: 'absolute', left: 8 }}>{tabBtn('search', <SearchRounded sx={{ fontSize: 24 }} />)}</Box>
        {tabBtn('emoji', <SentimentSatisfiedAltRounded sx={{ fontSize: 24 }} />)}
        {tabBtn('stickers', <AutoAwesomeOutlined sx={{ fontSize: 24 }} />)}
        {tabBtn('gifs', <GifBoxOutlined sx={{ fontSize: 24 }} />)}
        <Box sx={{ position: 'absolute', right: 8 }}>{tabBtn('delete', <BackspaceOutlined sx={{ fontSize: 24 }} />)}</Box>
      </Box>
    </Box>
  )
}
