import { useRef, useState } from 'react'
import { Box, IconButton, InputBase, useTheme } from '@mui/material'
import MenuRoundedIcon from '@mui/icons-material/MenuRounded'
import ArrowBackRoundedIcon from '@mui/icons-material/ArrowBackRounded'
import SearchRoundedIcon from '@mui/icons-material/SearchRounded'
import EditRoundedIcon from '@mui/icons-material/EditRounded'
import CloseRoundedIcon from '@mui/icons-material/CloseRounded'
import { AnimatePresence, motion } from 'framer-motion'
import { EASE } from '../motion'
import type { Chat } from '../data'
import ChatListItem from './ChatListItem'
import NotificationBanner from './NotificationBanner'
import MainMenu from './MainMenu'
import ComposeMenu from './ComposeMenu'
import SettingsView from './SettingsView'
import NewGroupFlow from './NewGroupFlow'
import NewChannelFlow from './NewChannelFlow'
import NewPrivateChat from './NewPrivateChat'
import SearchView from './SearchView'
import { useT } from '../i18n'

const MotionFab = motion(IconButton)
interface Props {
  chats: Chat[]
  selectedId: string
  onSelect: (id: string) => void
  onCreateGroup: (name: string) => void
  onCreateChannel: (name: string, description: string) => void
  onToggleMode: (coords?: { x: number; y: number }) => void
  fullWidth?: boolean
}

export default function Sidebar({
  chats,
  selectedId,
  onSelect,
  onCreateGroup,
  onCreateChannel,
  onToggleMode,
  fullWidth = false,
}: Props) {
  const theme = useTheme()
  const t = useT()
  const tg = theme.tg
  const mode = theme.palette.mode
  const [showBanner, setShowBanner] = useState(true)
  const [query, setQuery] = useState('')
  const [searching, setSearching] = useState(false)
  const [menuOpen, setMenuOpen] = useState(false)
  const [composeOpen, setComposeOpen] = useState(false)
  const [showSettings, setShowSettings] = useState(false)
  const [newGroupOpen, setNewGroupOpen] = useState(false)
  const [newChannelOpen, setNewChannelOpen] = useState(false)
  const [newPrivateOpen, setNewPrivateOpen] = useState(false)
  const inputRef = useRef<HTMLInputElement>(null)

  const closeSearch = () => {
    setSearching(false)
    setQuery('')
    inputRef.current?.blur()
  }

  return (
    <Box
      sx={{
        position: 'sticky',
        top: '16px',
        zIndex: 20,
        width: fullWidth ? 'auto' : 360,
        flex: fullWidth ? '1 1 auto' : '0 0 auto',
        minWidth: 0,
        mt: 2,
        ml: '16px',
        mr: fullWidth ? '16px' : 0,
        height: 'calc(100vh - 32px)',
        background: tg.sidebarBg,
        borderRadius: '24px',
        overflow: 'hidden',
        boxShadow:
          mode === 'dark' ? '0 10px 40px rgba(0,0,0,0.45)' : '0 10px 40px rgba(80,60,160,0.18)',
        display: 'flex',
        flexDirection: 'column',
      }}
    >
      {/* Header */}
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, px: 1.5, py: 1 }}>
        <IconButton
          onClick={() => (searching ? closeSearch() : setMenuOpen((o) => !o))}
          sx={{ color: tg.textSecondary }}
        >
          <AnimatePresence mode="wait" initial={false}>
            <motion.span
              key={searching ? 'back' : 'menu'}
              initial={{ rotate: -90, opacity: 0 }}
              animate={{ rotate: 0, opacity: 1 }}
              exit={{ rotate: 90, opacity: 0 }}
              transition={{ duration: 0.18 }}
              style={{ display: 'inline-flex' }}
            >
              {searching ? <ArrowBackRoundedIcon /> : <MenuRoundedIcon />}
            </motion.span>
          </AnimatePresence>
        </IconButton>
        <Box
          onClick={() => inputRef.current?.focus()}
          sx={{
            flex: 1,
            display: 'flex',
            alignItems: 'center',
            gap: 1,
            cursor: 'text',
            background: mode === 'dark' ? '#181818' : '#f0f0f2',
            borderRadius: '9999px',
            height: 44,
            px: 1.75,
            py: 0,
            border: `1.5px solid ${searching ? tg.accent : 'transparent'}`,
            transition: 'border-color .18s ease, background .18s ease',
            '&:hover': {
              borderColor: searching
                ? tg.accent
                : mode === 'dark'
                  ? 'rgba(255,255,255,0.18)'
                  : 'rgba(0,0,0,0.18)',
            },
          }}
        >
          <SearchRoundedIcon sx={{ color: searching ? tg.accent : tg.textFaint, fontSize: 22 }} />
          <InputBase
            inputRef={inputRef}
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onFocus={() => setSearching(true)}
            placeholder={t('Search')}
            sx={{
              flex: 1,
              fontFamily:
                'Roboto, -apple-system, "apple color emoji", "system-ui", "Segoe UI", Roboto, Oxygen-Sans, Ubuntu, Cantarell, "Helvetica Neue", sans-serif',
              fontSize: '16px',
              fontWeight: 400,
              lineHeight: '21px',
              fontStyle: 'normal',
              color: tg.textPrimary,
              '& input': {
                padding: 0,
                height: '21px',
                fontSize: '16px',
                fontWeight: 400,
                lineHeight: '21px',
                color: tg.textPrimary,
              },
              '& input::placeholder': { color: tg.textFaint, opacity: 1 },
            }}
          />
        </Box>
      </Box>

      {/* Body — chat list always mounted; search view overlays it */}
      <Box sx={{ flex: 1, position: 'relative', minHeight: 0 }}>
        {/* Chat list (always present) */}
        <Box sx={{ position: 'absolute', inset: 0, overflowY: 'auto' }}>
          <AnimatePresence initial={false}>
            {showBanner && <NotificationBanner onClose={() => setShowBanner(false)} />}
          </AnimatePresence>
          <Box sx={{ pt: 0.5, pb: 2 }}>
            {chats.map((chat, i) => (
              <ChatListItem
                key={chat.id}
                chat={chat}
                index={i}
                selected={chat.id === selectedId}
                onClick={() => onSelect(chat.id)}
              />
            ))}
          </Box>
        </Box>

        {/* Search view overlay — conditional (unmounts instantly, no stuck exit) */}
        {searching && (
          <Box
            sx={{
              position: 'absolute',
              inset: 0,
              overflow: 'hidden',
              background: tg.sidebarBg,
              zIndex: 10,
            }}
          >
            <Box
              component={motion.div}
              initial={{ opacity: 0, scale: 0.96, y: -6 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              transition={{ duration: 0.22, ease: EASE }}
              sx={{ height: '100%', transformOrigin: 'top center' }}
            >
              <SearchView query={query} chats={chats} onSelect={onSelect} />
            </Box>
          </Box>
        )}
      </Box>

      {/* Compose FAB (hidden while searching) */}
      <AnimatePresence>
        {!searching && (
          <MotionFab
            onClick={() => setComposeOpen((o) => !o)}
            initial={{ y: 96, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 96, opacity: 0 }}
            whileHover={{ scale: 1.08 }}
            whileTap={{ scale: 0.92 }}
            transition={{ type: 'spring', stiffness: 420, damping: 32 }}
            sx={{
              position: 'absolute',
              right: 20,
              bottom: 20,
              zIndex: 32,
              width: 56,
              height: 56,
              background: tg.accentGradient,
              color: '#fff',
              '&:hover': { background: tg.accentGradient },
            }}
          >
            <motion.span
              animate={{ rotate: composeOpen ? 90 : 0 }}
              transition={{ duration: 0.2 }}
              style={{ display: 'inline-flex' }}
            >
              {composeOpen ? <CloseRoundedIcon /> : <EditRoundedIcon />}
            </motion.span>
          </MotionFab>
        )}
      </AnimatePresence>

      {/* Overlays */}
      <MainMenu
        open={menuOpen}
        onClose={() => setMenuOpen(false)}
        onOpenSettings={() => {
          setMenuOpen(false)
          setShowSettings(true)
        }}
      />
      <ComposeMenu
        open={composeOpen}
        onClose={() => setComposeOpen(false)}
        onNewGroup={() => setNewGroupOpen(true)}
        onNewPrivate={() => setNewPrivateOpen(true)}
        onNewChannel={() => setNewChannelOpen(true)}
      />
      <AnimatePresence>
        {showSettings && (
          <SettingsView onBack={() => setShowSettings(false)} onToggleMode={onToggleMode} />
        )}
      </AnimatePresence>
      <AnimatePresence>
        {newGroupOpen && (
          <NewGroupFlow
            onClose={() => setNewGroupOpen(false)}
            onCreate={(name) => {
              onCreateGroup(name)
              setNewGroupOpen(false)
            }}
          />
        )}
      </AnimatePresence>
      <AnimatePresence>
        {newChannelOpen && (
          <NewChannelFlow
            onClose={() => setNewChannelOpen(false)}
            onCreate={(name, description) => {
              onCreateChannel(name, description)
              setNewChannelOpen(false)
            }}
          />
        )}
      </AnimatePresence>
      <AnimatePresence>
        {newPrivateOpen && (
          <NewPrivateChat
            chats={chats}
            onClose={() => setNewPrivateOpen(false)}
            onSelect={onSelect}
          />
        )}
      </AnimatePresence>
    </Box>
  )
}
