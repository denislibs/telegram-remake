import { useEffect, useState, type RefObject } from 'react'
import { Box, Typography, useTheme } from '@mui/material'
import { motion } from 'framer-motion'
import Avatar from './Avatar'

export interface Story {
  id: string
  name: string
  bg: string
  emoji?: string
  seen?: boolean
}

export const STORIES: Story[] = [
  { id: 's1', name: 'My Story', bg: 'linear-gradient(215deg, #34c76f -1.61%, #3da1fd 97.44%)', emoji: '➕' },
  { id: 's2', name: 'Alice', bg: 'linear-gradient(135deg, #ff6a88 0%, #ff99ac 100%)', emoji: '🌸' },
  { id: 's3', name: 'Bob Anderson', bg: 'linear-gradient(135deg, #f7971e 0%, #ffd200 100%)', emoji: 'B' },
  { id: 's4', name: 'Catherine', bg: 'linear-gradient(135deg, #43cea2 0%, #185a9d 100%)', emoji: '🌊' },
  { id: 's5', name: 'Daniel', bg: 'linear-gradient(135deg, #654ea3 0%, #eaafc8 100%)', emoji: 'D', seen: true },
  { id: 's6', name: 'Emma', bg: 'linear-gradient(135deg, #ee9ca7 0%, #ffdde1 100%)', emoji: '🎨' },
  { id: 's7', name: 'Frank', bg: 'linear-gradient(135deg, #2980b9 0%, #6dd5fa 100%)', emoji: 'F', seen: true },
  { id: 's8', name: 'Grace', bg: 'linear-gradient(135deg, #c471f5 0%, #fa71cd 100%)', emoji: '✨' },
]

const FULL_H = 92
const FOLDED_H = 44
const ITEM_W = 74
const STACK = 3 // how many avatars stay in the folded cluster
const FOLD_DISTANCE = 80 // px of list scroll to fully fold
const lerp = (a: number, b: number, t: number) => a + (b - a) * t

export default function StoriesRow({
  onOpen,
  scrollRef,
}: {
  onOpen: (index: number) => void
  scrollRef?: RefObject<HTMLDivElement | null>
}) {
  const tg = useTheme().tg
  // p: 0 = fully expanded row, 1 = folded stack — driven by the chat-list scroll
  const [p, setP] = useState(0)

  useEffect(() => {
    const el = scrollRef?.current
    if (!el) return
    let raf = 0
    const onScroll = () => {
      cancelAnimationFrame(raf)
      raf = requestAnimationFrame(() =>
        setP(Math.min(1, Math.max(0, el.scrollTop / FOLD_DISTANCE))),
      )
    }
    el.addEventListener('scroll', onScroll, { passive: true })
    onScroll()
    return () => {
      el.removeEventListener('scroll', onScroll)
      cancelAnimationFrame(raf)
    }
  }, [scrollRef])

  return (
    <Box
      sx={{
        display: 'flex',
        alignItems: 'flex-start',
        height: lerp(FULL_H, FOLDED_H, p),
        padding: '6px 8px 0',
        overflowX: p > 0.02 ? 'hidden' : 'auto',
        overflowY: 'hidden',
        '&::-webkit-scrollbar': { display: 'none' },
        scrollbarWidth: 'none',
      }}
    >
      {STORIES.map((story, index) => {
        const ringBg = story.seen
          ? tg.textFaint
          : 'linear-gradient(215deg, #34c76f -1.61%, #3da1fd 97.44%)'
        const stacked = index < STACK
        // folded target: pull each item left so the first few overlap into a stack
        const tx = p * -index * 56
        const sc = lerp(1, 0.42, p)
        const itemOpacity = stacked ? 1 : Math.max(0, 1 - p * 2.2)
        const nameOpacity = Math.max(0, 1 - p * 1.6)
        return (
          <Box
            key={story.id}
            component={motion.div}
            whileTap={{ scale: 0.95 }}
            onClick={() => onOpen(index)}
            sx={{
              position: 'relative',
              flexShrink: 0,
              width: ITEM_W,
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              cursor: 'pointer',
              transform: `translateX(${tx}px) scale(${sc})`,
              transformOrigin: 'top left',
              opacity: itemOpacity,
              zIndex: stacked ? STACK - index : 0,
              pointerEvents: p > 0.6 && !stacked ? 'none' : 'auto',
            }}
          >
            {/* Gradient ring wrapper */}
            <Box
              sx={{
                width: 62,
                height: 62,
                borderRadius: '50%',
                background: ringBg,
                opacity: story.seen ? 0.45 : 1,
                padding: '2px',
                boxSizing: 'border-box',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                flexShrink: 0,
              }}
            >
              <Box
                sx={{
                  width: '100%',
                  height: '100%',
                  borderRadius: '50%',
                  background: tg.sidebarBg,
                  padding: '2px',
                  boxSizing: 'border-box',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                <Avatar background={story.bg} emoji={story.emoji} size={54} />
              </Box>
            </Box>
            <Typography
              noWrap
              sx={{
                mt: 0.625,
                width: '100%',
                px: '2px',
                fontSize: 12,
                lineHeight: '15px',
                color: tg.textSecondary,
                textAlign: 'center',
                opacity: nameOpacity,
              }}
            >
              {story.name}
            </Typography>
          </Box>
        )
      })}
    </Box>
  )
}
