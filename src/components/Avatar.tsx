import { Box } from '@mui/material'

interface AvatarProps {
  background: string
  text?: string
  emoji?: string
  size?: number
  color?: string
}

export default function Avatar({ background, text, emoji, size = 54, color = '#fff' }: AvatarProps) {
  return (
    <Box
      sx={{
        width: size,
        height: size,
        borderRadius: '50%',
        background,
        flexShrink: 0,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        color,
        fontWeight: 600,
        fontSize: size * 0.42,
        userSelect: 'none',
        lineHeight: 1,
        overflow: 'hidden',
      }}
    >
      {emoji === 'tg-logo' ? (
        <svg width={size * 0.62} height={size * 0.62} viewBox="0 0 24 24" fill="#fff" aria-label="Telegram">
          <path d="M21.8 3.1 1.9 10.8c-1 .4-1 1.8 0 2.1l5 1.6 1.9 6c.3.9 1.4 1.1 2 .4l2.7-2.7 5 3.7c.7.5 1.7.1 1.9-.7l3.4-16c.2-1-.7-1.8-1.6-1.4zM9.5 14.3l8.6-5.3c.2-.1.4.2.2.3l-7 6.6c-.2.2-.3.5-.3.8l-.2 2.4-1.3-4.1c-.1-.3 0-.6.2-.7z" />
        </svg>
      ) : (
        (text ?? emoji)
      )}
    </Box>
  )
}
