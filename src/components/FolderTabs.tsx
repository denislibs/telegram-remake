import { Box, Typography, useTheme } from '@mui/material'
import { motion } from 'framer-motion'
import { useT } from '../i18n'

export type FolderKey = 'all' | 'private' | 'groups' | 'channels'

export default function FolderTabs({
  value,
  onChange,
}: {
  value: FolderKey
  onChange: (k: FolderKey) => void
}) {
  const tg = useTheme().tg
  const t = useT()

  const tabs: { key: FolderKey; label: string }[] = [
    { key: 'all', label: t('All Chats') },
    { key: 'private', label: t('Private') },
    { key: 'groups', label: t('Groups') },
    { key: 'channels', label: t('Channels') },
  ]

  return (
    <Box
      sx={{
        display: 'flex',
        gap: '4px',
        px: 1,
        pt: 0.5,
        pb: 1.25,
        flexShrink: 0,
        overflowX: 'auto',
        '&::-webkit-scrollbar': { display: 'none' },
        scrollbarWidth: 'none',
      }}
    >
      {tabs.map(({ key, label }) => {
        const active = key === value
        return (
          <Box
            key={key}
            onClick={() => onChange(key)}
            sx={{
              position: 'relative',
              flexShrink: 0,
              padding: '6px 16px',
              fontSize: 15,
              fontWeight: 600,
              borderRadius: '20px',
              cursor: 'pointer',
              color: active ? tg.accent : tg.textSecondary,
              transition: 'color 0.2s',
            }}
          >
            {active && (
              <Box
                component={motion.div}
                layoutId="folderTab"
                sx={{
                  position: 'absolute',
                  inset: 0,
                  borderRadius: '20px',
                  background: 'rgba(135,116,225,0.18)',
                }}
              />
            )}
            <Typography
              component="span"
              sx={{
                position: 'relative',
                fontSize: 15,
                fontWeight: 600,
                whiteSpace: 'nowrap',
              }}
            >
              {label}
            </Typography>
          </Box>
        )
      })}
    </Box>
  )
}
