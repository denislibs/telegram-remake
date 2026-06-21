import { useState } from 'react'
import { Box, IconButton, InputBase, Typography, useTheme } from '@mui/material'
import PhotoCameraRounded from '@mui/icons-material/PhotoCameraRounded'
import DoneRounded from '@mui/icons-material/DoneRounded'
import Avatar from '../Avatar'
import { useT } from '../../i18n'
import { SettingsScreen, Section, useCardBg } from './kit'

const BIO_MAX = 70

export default function EditProfile({ onBack }: { onBack: () => void }) {
  const tg = useTheme().tg
  const t = useT()
  const cardBg = useCardBg()
  const [first, setFirst] = useState('Дн')
  const [last, setLast] = useState('')
  const [bio, setBio] = useState('')
  const [username, setUsername] = useState('denis_m')

  const uname = username.trim()
  const usernameValid = /^[A-Za-z][A-Za-z0-9_]{4,31}$/.test(uname)
  const usernameMsg = !uname
    ? t('Minimum 5 characters.')
    : usernameValid
      ? t('This username is available.')
      : t('Username must be 5–32 chars: letters, digits, underscore.')
  const usernameColor = !uname ? tg.textSecondary : usernameValid ? '#4dcd5e' : '#ff595a'

  const field = (placeholder: string, value: string, onChange: (v: string) => void, max?: number) => (
    <Box sx={{ px: 2, py: 1.15, mx: 0.5 }}>
      <Box sx={{ display: 'flex', alignItems: 'center' }}>
        <InputBase
          value={value}
          onChange={(e) => onChange(max ? e.target.value.slice(0, max) : e.target.value)}
          placeholder={placeholder}
          sx={{
            flex: 1,
            fontSize: 16,
            color: tg.textPrimary,
            '& input::placeholder': { color: tg.textFaint, opacity: 1 },
          }}
        />
        {max && (
          <Typography sx={{ fontSize: 13, color: tg.textFaint }}>{max - value.length}</Typography>
        )}
      </Box>
    </Box>
  )

  return (
    <SettingsScreen
      title="Edit Profile"
      onBack={onBack}
      headerRight={
        <IconButton onClick={onBack} sx={{ color: tg.accent }}>
          <DoneRounded />
        </IconButton>
      }
    >
      {/* avatar with camera overlay */}
      <Box sx={{ display: 'flex', justifyContent: 'center', py: 2 }}>
        <Box sx={{ position: 'relative', cursor: 'pointer' }}>
          <Avatar background="linear-gradient(135deg,#ff8a5b,#ff6a3d)" text={first[0] || 'Д'} size={110} />
          <Box
            sx={{
              position: 'absolute',
              inset: 0,
              borderRadius: '50%',
              background: 'rgba(0,0,0,0.28)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              opacity: 0,
              transition: 'opacity .15s ease',
              '&:hover': { opacity: 1 },
            }}
          >
            <PhotoCameraRounded sx={{ color: '#fff', fontSize: 34 }} />
          </Box>
        </Box>
      </Box>

      <Section footer="Add a few lines about yourself.">
        {field(t('First name (required)'), first, setFirst)}
        <Box sx={{ height: 1, background: tg.divider, mx: 2 }} />
        {field(t('Last name (optional)'), last, setLast)}
        <Box sx={{ height: 1, background: tg.divider, mx: 2 }} />
        {field(t('Bio (optional)'), bio, setBio, BIO_MAX)}
      </Section>

      <Typography sx={{ px: 3, pb: 0.5, fontSize: 14, fontWeight: 600, color: tg.accent }}>
        {t('Username')}
      </Typography>
      <Box sx={{ mx: 1.25, borderRadius: '16px', background: cardBg, py: 0.5 }}>
        <Box sx={{ px: 2, py: 1.15, mx: 0.5, display: 'flex', alignItems: 'center' }}>
          <Typography sx={{ fontSize: 16, color: tg.textFaint }}>t.me/</Typography>
          <InputBase
            value={username}
            onChange={(e) => setUsername(e.target.value.replace(/[^A-Za-z0-9_]/g, ''))}
            sx={{ flex: 1, fontSize: 16, color: tg.textPrimary }}
          />
        </Box>
      </Box>
      <Typography sx={{ px: 3, pt: 0.75, fontSize: 13.5, color: usernameColor }}>
        {usernameMsg}
      </Typography>
    </SettingsScreen>
  )
}
