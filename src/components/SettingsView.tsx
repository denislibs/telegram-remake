import { useState } from 'react'
import type { ReactNode } from 'react'
import { Box, IconButton, Switch, Typography, useTheme } from '@mui/material'
import { motion } from 'framer-motion'
import ArrowBackRounded from '@mui/icons-material/ArrowBackRounded'
import DarkModeOutlined from '@mui/icons-material/DarkModeOutlined'
import QrCode2Rounded from '@mui/icons-material/QrCode2Rounded'
import EditRounded from '@mui/icons-material/EditRounded'
import MoreVertRounded from '@mui/icons-material/MoreVertRounded'
import CallOutlined from '@mui/icons-material/CallOutlined'
import AlternateEmailRounded from '@mui/icons-material/AlternateEmailRounded'
import NotificationsNoneRounded from '@mui/icons-material/NotificationsNoneRounded'
import StorageRounded from '@mui/icons-material/StorageRounded'
import LockOutlined from '@mui/icons-material/LockOutlined'
import SettingsOutlined from '@mui/icons-material/SettingsOutlined'
import FolderOutlined from '@mui/icons-material/FolderOutlined'
import EmojiEmotionsOutlined from '@mui/icons-material/EmojiEmotionsOutlined'
import VideocamOutlined from '@mui/icons-material/VideocamOutlined'
import DevicesOutlined from '@mui/icons-material/DevicesOutlined'
import TranslateRounded from '@mui/icons-material/TranslateRounded'
import KeyboardOutlined from '@mui/icons-material/KeyboardOutlined'
import Avatar from './Avatar'

const settingsItems: { icon: ReactNode; label: string; value?: string }[] = [
  { icon: <NotificationsNoneRounded />, label: 'Notifications and Sounds' },
  { icon: <StorageRounded />, label: 'Data and Storage' },
  { icon: <LockOutlined />, label: 'Privacy and Security' },
  { icon: <SettingsOutlined />, label: 'General Settings' },
  { icon: <FolderOutlined />, label: 'Chat Folders' },
  { icon: <EmojiEmotionsOutlined />, label: 'Stickers and Emoji' },
  { icon: <VideocamOutlined />, label: 'Speakers and Camera' },
  { icon: <DevicesOutlined />, label: 'Devices', value: '3' },
  { icon: <TranslateRounded />, label: 'Language', value: 'English' },
  { icon: <KeyboardOutlined />, label: 'Keyboard Shortcuts' },
]

export default function SettingsView({
  onBack,
  onToggleMode,
}: {
  onBack: () => void
  onToggleMode: () => void
}) {
  const theme = useTheme()
  const tg = theme.tg
  const isDark = theme.palette.mode === 'dark'
  const cardBg = isDark ? '#2b2b2b' : '#ffffff'
  const [active, setActive] = useState('Notifications and Sounds')

  return (
    <motion.div
      initial={{ x: '100%' }}
      animate={{ x: '0%' }}
      exit={{ x: '100%' }}
      transition={{ duration: 0.24, ease: [0.16, 1, 0.3, 1] }}
      style={{
        position: 'absolute',
        inset: 0,
        zIndex: 40,
        background: tg.sidebarBg,
        display: 'flex',
        flexDirection: 'column',
      }}
    >
      {/* Header */}
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, px: 1, py: 1.25 }}>
        <IconButton onClick={onBack} sx={{ color: tg.textSecondary }}>
          <ArrowBackRounded />
        </IconButton>
        <Typography sx={{ flex: 1, fontSize: 19, fontWeight: 600, color: tg.textPrimary }}>
          Settings
        </Typography>
        <IconButton sx={{ color: tg.textSecondary }}>
          <QrCode2Rounded />
        </IconButton>
        <IconButton sx={{ color: tg.textSecondary }}>
          <EditRounded />
        </IconButton>
        <IconButton sx={{ color: tg.textSecondary }}>
          <MoreVertRounded />
        </IconButton>
      </Box>

      {/* Scrollable body */}
      <Box sx={{ flex: 1, overflowY: 'auto', pb: 3 }}>
        {/* Avatar + name */}
        <Box
          sx={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: 1,
            pt: 1,
            pb: 3,
          }}
        >
          <Avatar background="linear-gradient(135deg,#ff8a5b,#ff6a3d)" text="Д" size={130} />
          <Typography sx={{ fontSize: 21, fontWeight: 600, color: tg.textPrimary, mt: 1 }}>
            Дн
          </Typography>
          <Typography sx={{ fontSize: 14, color: tg.textSecondary }}>online</Typography>
        </Box>

        {/* Contact card */}
        <Box sx={{ mx: 1.25, mb: 1.5, borderRadius: '16px', background: cardBg, py: 0.5 }}>
          <InfoRow icon={<CallOutlined />} title="+7 925 481 7290" subtitle="Phone" />
          <InfoRow icon={<AlternateEmailRounded />} title="denis_m" subtitle="Username" />
        </Box>

        {/* Appearance — theme toggle */}
        <Box sx={{ mx: 1.25, mb: 1.5, borderRadius: '16px', background: cardBg, py: 0.5 }}>
          <Box
            onClick={onToggleMode}
            sx={{
              display: 'flex',
              alignItems: 'center',
              gap: 2,
              px: 2,
              py: 0.75,
              mx: 0.5,
              borderRadius: '12px',
              cursor: 'pointer',
              '&:hover': { background: tg.hover },
            }}
          >
            <DarkModeOutlined sx={{ color: tg.textSecondary, fontSize: 24 }} />
            <Typography sx={{ flex: 1, fontSize: 16, color: tg.textPrimary }}>Night Mode</Typography>
            <Switch
              checked={isDark}
              onChange={onToggleMode}
              onClick={(e) => e.stopPropagation()}
              sx={{
                '& .MuiSwitch-switchBase.Mui-checked': { color: '#fff' },
                '& .MuiSwitch-switchBase.Mui-checked + .MuiSwitch-track': {
                  backgroundColor: tg.accent,
                  opacity: 1,
                },
              }}
            />
          </Box>
        </Box>

        {/* Settings list */}
        <Box sx={{ mx: 1.25, borderRadius: '16px', background: cardBg, py: 0.75 }}>
          {settingsItems.map((it) => {
            const isActive = it.label === active
            return (
              <Box
                key={it.label}
                onClick={() => setActive(it.label)}
                sx={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 2,
                  px: 2,
                  py: 1.25,
                  mx: 0.75,
                  borderRadius: '12px',
                  cursor: 'pointer',
                  background: isActive ? tg.hover : 'transparent',
                  '&:hover': { background: tg.hover },
                }}
              >
                <Box sx={{ color: tg.textSecondary, display: 'flex', '& svg': { fontSize: 24 } }}>
                  {it.icon}
                </Box>
                <Typography sx={{ flex: 1, fontSize: 16, color: tg.textPrimary }}>
                  {it.label}
                </Typography>
                {it.value && (
                  <Typography sx={{ fontSize: 15, color: tg.textFaint }}>{it.value}</Typography>
                )}
              </Box>
            )
          })}
        </Box>
      </Box>
    </motion.div>
  )
}

function InfoRow({ icon, title, subtitle }: { icon: ReactNode; title: string; subtitle: string }) {
  const tg = useTheme().tg
  return (
    <Box
      sx={{
        display: 'flex',
        alignItems: 'center',
        gap: 2,
        px: 2,
        py: 1,
        mx: 0.75,
        borderRadius: '12px',
        cursor: 'pointer',
        '&:hover': { background: tg.hover },
      }}
    >
      <Box sx={{ color: tg.textSecondary, display: 'flex', '& svg': { fontSize: 24 } }}>{icon}</Box>
      <Box>
        <Typography sx={{ fontSize: 16, color: tg.textPrimary }}>{title}</Typography>
        <Typography sx={{ fontSize: 13.5, color: tg.textSecondary }}>{subtitle}</Typography>
      </Box>
    </Box>
  )
}
