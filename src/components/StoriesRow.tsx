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

export default function StoriesRow({ onOpen }: { onOpen: (index: number) => void }) {
  const tg = useTheme().tg

  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'row',
        alignItems: 'flex-start',
        height: 82,
        padding: '5px 10px',
        overflowX: 'auto',
        overflowY: 'hidden',
        '&::-webkit-scrollbar': { display: 'none' },
        scrollbarWidth: 'none',
      }}
    >
      {STORIES.map((story, index) => {
        const ringBg = story.seen
          ? tg.textFaint
          : 'linear-gradient(215deg, #34c76f -1.61%, #3da1fd 97.44%)'
        return (
          <Box
            key={story.id}
            component={motion.div}
            whileTap={{ scale: 0.95 }}
            onClick={() => onOpen(index)}
            sx={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              flexShrink: 0,
              width: 74,
              cursor: 'pointer',
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
              }}
            >
              {/* Inner gap ring (surface-coloured) */}
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
                mt: 0.5,
                fontSize: 12,
                color: tg.textSecondary,
                textAlign: 'center',
                maxWidth: 64,
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
