import { useEffect } from 'react'
import { Box, Typography, useTheme } from '@mui/material'
import { motion } from 'framer-motion'
import SentimentSatisfiedAltRounded from '@mui/icons-material/SentimentSatisfiedAltRounded'
import GifBoxOutlined from '@mui/icons-material/GifBoxOutlined'
import AutoAwesomeOutlined from '@mui/icons-material/AutoAwesomeOutlined'
import { EASE } from '../motion'
import { useT } from '../i18n'

const CATEGORIES: { title: string; emojis: string[] }[] = [
  {
    title: 'Smileys',
    emojis: [
      '😀', '😃', '😄', '😁', '😆', '😅', '😂', '🤣',
      '😊', '😇', '🙂', '😉', '😌', '😍', '🥰', '😘',
      '😎', '🤩', '🥳', '😏', '😴', '🤔',
    ],
  },
  {
    title: 'Animals',
    emojis: ['🐶', '🐱', '🐭', '🐹', '🐰', '🦊', '🐻', '🐼', '🐨', '🐯', '🦁', '🐮'],
  },
  {
    title: 'Food',
    emojis: ['🍎', '🍌', '🍇', '🍓', '🍕', '🍔', '🍟', '🌮', '🍣', '🍩', '🍪', '☕'],
  },
  {
    title: 'Activities',
    emojis: ['⚽', '🏀', '🏈', '🎾', '🎮', '🎯', '🎲', '🎸', '🎺', '🏆', '🥇', '🎬'],
  },
]

const TAB_ICON_SX = { fontSize: 24 }

export default function EmojiPicker({
  onPick,
  onClose,
}: {
  onPick: (emoji: string) => void
  onClose: () => void
}) {
  const tg = useTheme().tg
  const t = useT()

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose()
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [onClose])

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
        width: 360,
        height: 420,
        background: tg.menuBg,
        backdropFilter: 'blur(40px)',
        WebkitBackdropFilter: 'blur(40px)',
        borderRadius: '16px',
        boxShadow: tg.menuShadow,
        overflow: 'hidden',
        display: 'flex',
        flexDirection: 'column',
        transformOrigin: 'bottom right',
        zIndex: 30,
      }}
    >
      <Box sx={{ flex: 1, overflowY: 'auto', p: '8px' }}>
        {CATEGORIES.map((cat) => (
          <Box key={cat.title} sx={{ mb: 1 }}>
            <Typography
              sx={{ fontSize: 13, color: tg.textFaint, px: '4px', py: '6px', fontWeight: 500 }}
            >
              {t(cat.title)}
            </Typography>
            <Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(8, 1fr)' }}>
              {cat.emojis.map((emoji, i) => (
                <Box
                  key={`${cat.title}-${i}`}
                  onClick={() => onPick(emoji)}
                  sx={{
                    fontSize: 26,
                    height: 40,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    cursor: 'pointer',
                    borderRadius: '8px',
                    '&:hover': { background: tg.hover },
                  }}
                >
                  {emoji}
                </Box>
              ))}
            </Box>
          </Box>
        ))}
      </Box>

      <Box
        sx={{
          height: 49,
          flexShrink: 0,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          gap: 1,
          borderTop: `1px solid ${tg.divider}`,
        }}
      >
        <Box
          sx={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            width: 40,
            height: 36,
            borderRadius: '8px',
            color: tg.accent,
            background: 'rgba(135,116,225,0.12)',
            cursor: 'pointer',
          }}
        >
          <SentimentSatisfiedAltRounded sx={TAB_ICON_SX} />
        </Box>
        <Box
          sx={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            width: 40,
            height: 36,
            borderRadius: '8px',
            color: tg.textSecondary,
            cursor: 'pointer',
          }}
        >
          <GifBoxOutlined sx={TAB_ICON_SX} />
        </Box>
        <Box
          sx={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            width: 40,
            height: 36,
            borderRadius: '8px',
            color: tg.textSecondary,
            cursor: 'pointer',
          }}
        >
          <AutoAwesomeOutlined sx={TAB_ICON_SX} />
        </Box>
      </Box>
    </Box>
  )
}
