import { Box, useTheme } from '@mui/material'

/**
 * Telegram-style toggle (tweb _checkbox.scss): 31x14 track, 20px round thumb in
 * surface-color (so it reads dark in night theme), accent track when on.
 */
export default function TgSwitch({
  checked,
  onClick,
}: {
  checked: boolean
  onClick?: (e: React.MouseEvent) => void
}) {
  const theme = useTheme()
  const tg = theme.tg
  const off = theme.palette.mode === 'dark' ? '#54585c' : '#c4c9cc'
  return (
    <Box
      onClick={onClick}
      sx={{ position: 'relative', width: 31, height: 20, flexShrink: 0, cursor: 'pointer' }}
    >
      <Box
        sx={{
          position: 'absolute',
          top: 3,
          left: 0,
          width: 31,
          height: 14,
          borderRadius: 7,
          background: checked ? tg.accent : off,
          transition: 'background .15s ease',
        }}
      />
      <Box
        sx={{
          position: 'absolute',
          top: 0,
          left: checked ? 11 : 0,
          width: 20,
          height: 20,
          borderRadius: '50%',
          background: tg.sidebarBg,
          boxShadow: '0 1px 3px rgba(0,0,0,0.35)',
          transition: 'left .16s cubic-bezier(.22,.75,.7,1.3)',
        }}
      />
    </Box>
  )
}
