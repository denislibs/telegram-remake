import { useMemo, useState } from 'react'
import { flushSync } from 'react-dom'
import { Box, CssBaseline, ThemeProvider, useTheme } from '@mui/material'
import { buildTheme, type Mode } from './theme'
import Sidebar from './components/Sidebar'
import ChatView from './components/ChatView'
import ConversationView from './components/ConversationView'
import ChatBackground from './components/ChatBackground'
import { chats as initialChats, type Chat } from './data'

export type ToggleMode = (coords?: { x: number; y: number }) => void

const groupGradients = [
  'linear-gradient(135deg,#42e695,#3bb2b8)',
  'linear-gradient(135deg,#f7971e,#ffd200)',
  'linear-gradient(135deg,#6a11cb,#2575fc)',
  'linear-gradient(135deg,#ff5f6d,#ffc371)',
]

function Shell({ onToggleMode }: { onToggleMode: ToggleMode }) {
  const tg = useTheme().tg
  const [chatList, setChatList] = useState<Chat[]>(initialChats)
  const [selectedId, setSelectedId] = useState('dollhouse-work')

  const createGroup = (name: string) => {
    const id = `group-${Date.now()}`
    const grad = groupGradients[Math.floor(Math.random() * groupGradients.length)]
    const newGroup: Chat = {
      id,
      name: name || 'New Group',
      avatar: grad,
      avatarText: (name || 'G')[0].toUpperCase(),
      date: 'now',
      preview: 'Group created',
      type: 'group',
      owned: true,
      status: '1 member',
      messages: [{ type: 'date', text: 'Today' }],
    }
    setChatList((prev) => [prev[0], newGroup, ...prev.slice(1)])
    setSelectedId(id)
  }

  const createChannel = (name: string, description: string) => {
    const id = `channel-${Date.now()}`
    const grad = groupGradients[Math.floor(Math.random() * groupGradients.length)]
    const newChannel: Chat = {
      id,
      name: name || 'New Channel',
      avatar: grad,
      avatarText: (name || 'C')[0].toUpperCase(),
      date: 'now',
      preview: 'Channel created',
      type: 'channel',
      owned: true,
      status: '1 subscriber',
      description: description || undefined,
      messages: [{ type: 'date', text: 'Today' }],
    }
    setChatList((prev) => [prev[0], newChannel, ...prev.slice(1)])
    setSelectedId(id)
  }

  const selected = chatList.find((c) => c.id === selectedId) ?? chatList[0]

  return (
    <Box
      sx={{
        display: 'flex',
        alignItems: 'flex-start',
        minHeight: '100vh',
        background: tg.appBg,
      }}
    >
      {/* Animated 4-point gradient wallpaper + doodle pattern (tweb-style) */}
      <ChatBackground />
      <Sidebar
        chats={chatList}
        selectedId={selectedId}
        onSelect={setSelectedId}
        onCreateGroup={createGroup}
        onCreateChannel={createChannel}
        onToggleMode={onToggleMode}
      />
      {selectedId === 'dollhouse-work' ? (
        <ChatView />
      ) : (
        <ConversationView key={selectedId} chat={selected} />
      )}
    </Box>
  )
}

function getInitialMode(): Mode {
  const saved = localStorage.getItem('tg-theme')
  if (saved === 'light' || saved === 'dark') return saved
  return window.matchMedia?.('(prefers-color-scheme: dark)').matches ? 'dark' : 'light'
}

export default function App() {
  const [mode, setMode] = useState<Mode>(getInitialMode)
  const theme = useMemo(() => buildTheme(mode), [mode])

  const apply = (next: Mode) => {
    localStorage.setItem('tg-theme', next)
    setMode(next)
  }

  // Circular reveal from the toggle click (View Transitions API), like tweb;
  // falls back to an instant swap when unsupported / reduced-motion / no coords.
  const toggleMode: ToggleMode = (coords) => {
    const next: Mode = mode === 'dark' ? 'light' : 'dark'
    const start = (document as Document & { startViewTransition?: (cb: () => void) => { ready: Promise<void> } })
      .startViewTransition
    const reduce = window.matchMedia?.('(prefers-reduced-motion: reduce)').matches
    if (!start || !coords || reduce) {
      apply(next)
      return
    }
    const { x, y } = coords
    const transition = start.call(document, () => flushSync(() => apply(next)))
    transition.ready.then(() => {
      const endRadius = Math.hypot(Math.max(x, innerWidth - x), Math.max(y, innerHeight - y))
      document.documentElement.animate(
        {
          clipPath: [`circle(0px at ${x}px ${y}px)`, `circle(${endRadius}px at ${x}px ${y}px)`],
        },
        {
          duration: 450,
          easing: 'cubic-bezier(.4, 0, .2, 1)',
          pseudoElement: '::view-transition-new(root)',
        },
      )
    })
  }

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Shell onToggleMode={toggleMode} />
    </ThemeProvider>
  )
}
