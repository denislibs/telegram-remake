import { useEffect, useRef, useState } from 'react'
import type { ReactNode } from 'react'
import { createPortal } from 'react-dom'
import { Box, IconButton, InputBase, Typography, useTheme } from '@mui/material'
import { AnimatePresence, motion } from 'framer-motion'
import CallOutlined from '@mui/icons-material/CallOutlined'
import SearchRoundedIcon from '@mui/icons-material/SearchRounded'
import MoreVertRoundedIcon from '@mui/icons-material/MoreVertRounded'
import AttachFileRounded from '@mui/icons-material/AttachFileRounded'
import SentimentSatisfiedAltRounded from '@mui/icons-material/SentimentSatisfiedAltRounded'
import KeyboardVoiceRounded from '@mui/icons-material/KeyboardVoiceRounded'
import SendRounded from '@mui/icons-material/SendRounded'
import VolumeOffRounded from '@mui/icons-material/VolumeOffRounded'
import CardGiftcardRounded from '@mui/icons-material/CardGiftcardRounded'
import DoneRounded from '@mui/icons-material/DoneRounded'
import DoneAllRounded from '@mui/icons-material/DoneAllRounded'
import ReplyRounded from '@mui/icons-material/ReplyRounded'
import EditRounded from '@mui/icons-material/EditRounded'
import ContentCopyRounded from '@mui/icons-material/ContentCopyRounded'
import TranslateRounded from '@mui/icons-material/TranslateRounded'
import PushPinOutlined from '@mui/icons-material/PushPinOutlined'
import CheckCircleOutlineRounded from '@mui/icons-material/CheckCircleOutlineRounded'
import DeleteOutlineRounded from '@mui/icons-material/DeleteOutlineRounded'
import KeyboardArrowDownRounded from '@mui/icons-material/KeyboardArrowDownRounded'
import CloseRounded from '@mui/icons-material/CloseRounded'
import CalendarMonthOutlined from '@mui/icons-material/CalendarMonthOutlined'
import Avatar from './Avatar'
import UserInfoPanel from './UserInfoPanel'
import HeaderMenu from './HeaderMenu'
import type { Chat, ConvMsg, MsgStatus } from '../data'

const REACTIONS = ['❤️', '👍', '👎', '🔥', '🥰', '👏', '😁']

const replies = [
  'ахах да', 'ну ты даёшь 😄', 'согласен', 'хахаха', 'ладно', 'ок 👌', 'и не говори',
  'позже наберу', '🔥', 'да ну? серьёзно?', 'интересно', 'понятно', 'ну такое',
  'договорились 😌', 'я уже почти сплю 😴',
]

function nowTime() {
  const d = new Date()
  return `${String(d.getHours()).padStart(2, '0')}:${String(d.getMinutes()).padStart(2, '0')}`
}

function Ticks({ status, color }: { status?: MsgStatus; color: string }) {
  if (!status) return null
  const Icon = status === 'read' ? DoneAllRounded : DoneRounded
  return <Icon sx={{ fontSize: 16, color }} />
}

interface Props {
  chat: Chat
}

export default function ConversationView({ chat }: Props) {
  const theme = useTheme()
  const tg = theme.tg
  const mode = theme.palette.mode
  const incomingBg = tg.bubble
  const isChannel = chat.type === 'channel'
  const isGroup = chat.type === 'group'
  const canType = !isChannel

  const [msgs, setMsgs] = useState<ConvMsg[]>(chat.messages ?? [])
  const [input, setInput] = useState('')
  const [typing, setTyping] = useState(false)
  const [infoOpen, setInfoOpen] = useState(false)
  const [msgMenu, setMsgMenu] = useState<{ x: number; y: number; idx: number } | null>(null)
  const [reply, setReply] = useState<{ name: string; text: string } | null>(null)
  const [chatSearch, setChatSearch] = useState(false)
  const [chatSearchQuery, setChatSearchQuery] = useState('')
  const [headerMenu, setHeaderMenu] = useState<{ top: number; right: number } | null>(null)
  const scrollRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLInputElement>(null)

  const openMsgMenu = (e: React.MouseEvent, idx: number) => {
    e.preventDefault()
    setMsgMenu({
      x: Math.min(e.clientX, window.innerWidth - 250),
      y: Math.min(e.clientY, window.innerHeight - 470),
      idx,
    })
  }
  const startReply = () => {
    const m = msgMenu && msgs[msgMenu.idx]
    if (m && m.type !== 'date') {
      const name = m.out ? 'Дн' : m.sender ?? chat.name
      setReply({ name, text: m.text ?? m.emoji ?? '' })
      inputRef.current?.focus()
    }
    setMsgMenu(null)
  }
  const msgMenuItems: { icon: ReactNode; label: string; danger?: boolean; onClick?: () => void }[] = [
    { icon: <ReplyRounded />, label: 'Reply', onClick: startReply },
    { icon: <EditRounded />, label: 'Edit' },
    { icon: <ContentCopyRounded />, label: 'Copy' },
    { icon: <TranslateRounded />, label: 'Translate' },
    { icon: <PushPinOutlined />, label: 'Pin' },
    { icon: <ReplyRounded sx={{ transform: 'scaleX(-1)' }} />, label: 'Forward' },
    { icon: <CheckCircleOutlineRounded />, label: 'Select' },
    { icon: <DoneAllRounded />, label: 'Nobody viewed' },
    { icon: <DeleteOutlineRounded />, label: 'Delete', danger: true },
  ]

  // reset + focus input when switching chats
  useEffect(() => {
    setMsgs(chat.messages ?? [])
    setInput('')
    setTyping(false)
    setInfoOpen(false)
    setChatSearch(false)
    setChatSearchQuery('')
    setReply(null)
    if (canType) {
      const id = window.setTimeout(() => inputRef.current?.focus(), 0)
      return () => window.clearTimeout(id)
    }
  }, [chat, canType])

  useEffect(() => {
    window.scrollTo({ top: document.body.scrollHeight })
  }, [msgs, typing])

  const send = () => {
    const text = input.trim()
    if (!text || !canType) return
    setMsgs((prev) => [
      ...prev,
      { type: 'text', out: true, text, time: nowTime(), status: 'sent', reply: reply ?? undefined },
    ])
    setInput('')
    setReply(null)
    setTyping(true)
    window.setTimeout(() => {
      const r = replies[Math.floor(Math.random() * replies.length)]
      const botReply: ConvMsg = { type: 'text', out: false, text: r, time: nowTime() }
      if (isGroup) {
        const senders = [
          { n: 'Аня', c: '#ee7aae' },
          { n: 'Макс', c: '#65aadd' },
          { n: 'Лёха', c: '#7bc862' },
        ]
        const s = senders[Math.floor(Math.random() * senders.length)]
        botReply.sender = s.n
        botReply.senderColor = s.c
      }
      setMsgs((prev) => [...prev, botReply])
      setTyping(false)
    }, 1100 + Math.random() * 900)
  }

  const hasText = input.trim().length > 0

  return (
    <Box
      sx={{
        flex: 1,
        minWidth: 0,
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'flex-start',
        position: 'relative',
        background: 'transparent',
      }}
    >
      <Box sx={{ flex: 1, minWidth: 0, minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
        {/* Header */}
        <Box
          sx={{
            position: 'sticky',
            top: '16px',
            zIndex: 6,
            display: 'flex',
            alignItems: 'center',
            gap: 1.5,
            width: '100%',
            maxWidth: 688,
            mx: 'auto',
            mt: 2,
            mb: 0.5,
            px: 1.5,
            py: 0.5,
            height: 48,
            borderRadius: '24px',
            background: tg.bubble,
            boxShadow:
              mode === 'dark' ? '0 1px 6px -1px rgba(0,0,0,0.5)' : '0 1px 5px -1px rgba(0,0,0,0.16)',
          }}
        >
          <AnimatePresence mode="wait" initial={false}>
            {chatSearch ? (
              <Box
                key="search"
                component={motion.div}
                initial={{ opacity: 0, x: 26 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 26 }}
                transition={{ duration: 0.2, ease: [0.16, 1, 0.3, 1] }}
                sx={{ display: 'flex', alignItems: 'center', gap: 1, width: '100%' }}
              >
                <Avatar background={chat.avatar} text={chat.avatarText} emoji={chat.avatarEmoji} size={32} />
                <Box
                  sx={{
                    flex: 1,
                    display: 'flex',
                    alignItems: 'center',
                    gap: 1,
                    background: mode === 'dark' ? '#181818' : '#f0f0f2',
                    borderRadius: '9999px',
                    height: 38,
                    px: 1.5,
                  }}
                >
                  <SearchRoundedIcon sx={{ color: tg.textFaint, fontSize: 20 }} />
                  <InputBase
                    autoFocus
                    value={chatSearchQuery}
                    onChange={(e) => setChatSearchQuery(e.target.value)}
                    placeholder="Search"
                    sx={{
                      flex: 1,
                      fontSize: 16,
                      color: tg.textPrimary,
                      '& input::placeholder': { color: tg.textFaint, opacity: 1 },
                    }}
                  />
                  <IconButton
                    size="small"
                    onClick={() => {
                      if (chatSearchQuery) setChatSearchQuery('')
                      else setChatSearch(false)
                    }}
                    sx={{ color: tg.textFaint }}
                  >
                    <CloseRounded fontSize="small" />
                  </IconButton>
                </Box>
                <IconButton sx={{ color: tg.textSecondary }}>
                  <CalendarMonthOutlined />
                </IconButton>
              </Box>
            ) : (
              <Box
                key="normal"
                component={motion.div}
                initial={{ opacity: 0, x: -26 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -26 }}
                transition={{ duration: 0.2, ease: [0.16, 1, 0.3, 1] }}
                sx={{ display: 'flex', alignItems: 'center', gap: 1.5, width: '100%' }}
              >
                <Box
                  onClick={() => setInfoOpen((o) => !o)}
                  sx={{ display: 'flex', alignItems: 'center', gap: 1.5, flex: 1, minWidth: 0, cursor: 'pointer' }}
                >
                  <Avatar background={chat.avatar} text={chat.avatarText} emoji={chat.avatarEmoji} size={40} />
                  <Box sx={{ flex: 1, minWidth: 0 }}>
                    <Typography noWrap sx={{ fontWeight: 500, fontSize: 16, color: tg.textPrimary }}>
                      {chat.name}
                    </Typography>
                    <Typography noWrap sx={{ fontSize: 13.5, color: typing ? tg.accent : tg.textSecondary }}>
                      {typing ? 'печатает…' : chat.status}
                    </Typography>
                  </Box>
                </Box>
                {chat.type === 'private' && (
                  <IconButton sx={{ color: tg.textSecondary }}>
                    <CallOutlined />
                  </IconButton>
                )}
                <IconButton onClick={() => setChatSearch(true)} sx={{ color: tg.textSecondary }}>
                  <SearchRoundedIcon />
                </IconButton>
                <IconButton
                  onClick={(e) => {
                    const r = e.currentTarget.getBoundingClientRect()
                    setHeaderMenu({ top: r.bottom + 6, right: window.innerWidth - r.right })
                  }}
                  sx={{ color: tg.textSecondary }}
                >
                  <MoreVertRoundedIcon />
                </IconButton>
              </Box>
            )}
          </AnimatePresence>
        </Box>

        {/* In-chat search "no results" dropdown */}
        <AnimatePresence initial={false}>
          {chatSearch && chatSearchQuery.trim() && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.2, ease: [0.16, 1, 0.3, 1] }}
              style={{ overflow: 'hidden', position: 'sticky', top: 72, zIndex: 5, width: '100%', maxWidth: 688, margin: '0 auto' }}
            >
              <Box
                sx={{
                  background: tg.bubble,
                  borderRadius: '14px',
                  px: 2,
                  py: 2,
                  textAlign: 'center',
                }}
              >
                <Typography sx={{ fontSize: 15, color: tg.textSecondary }}>
                  There were no results for{' '}
                  <Box component="span" sx={{ fontWeight: 700, color: tg.textPrimary }}>
                    “{chatSearchQuery}”
                  </Box>
                  . Try a new search.
                </Typography>
              </Box>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Conversation — flows in the document (body scrolls) */}
        <Box
          ref={scrollRef}
          sx={{
            flex: 1,
            position: 'relative',
            zIndex: 1,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'flex-end',
          }}
        >
          <Box
            sx={{
              width: '100%',
              maxWidth: 688,
              px: 1.5,
              py: 1.5,
              display: 'flex',
              flexDirection: 'column',
              gap: '6px',
            }}
          >
            {msgs.map((m, i) => {
              if (m.type === 'date') {
                return (
                  <Box key={i} sx={{ display: 'flex', justifyContent: 'center', my: 1 }}>
                    <Box
                      sx={{
                        px: 1.5,
                        py: 0.4,
                        borderRadius: '14px',
                        background: 'rgba(0,0,0,0.45)',
                        color: '#fff',
                        fontSize: 15,
                        fontWeight: 500,
                      }}
                    >
                      {m.text}
                    </Box>
                  </Box>
                )
              }

              const out = !!m.out
              const tickColor = 'rgba(255,255,255,0.85)'

              return (
                <Box
                  key={i}
                  onContextMenu={(e) => openMsgMenu(e, i)}
                  sx={{ display: 'flex', justifyContent: out ? 'flex-end' : 'flex-start' }}
                >
                  {m.type === 'sticker' ? (
                    <Box sx={{ position: 'relative', display: 'inline-block', px: 0.5 }}>
                      <Box sx={{ fontSize: 96, lineHeight: 1, userSelect: 'none' }}>{m.emoji}</Box>
                      <Box
                        sx={{
                          position: 'absolute',
                          right: 6,
                          bottom: 4,
                          display: 'flex',
                          alignItems: 'center',
                          gap: 0.25,
                          px: 0.75,
                          py: 0.2,
                          borderRadius: '11px',
                          background: 'rgba(0,0,0,0.45)',
                        }}
                      >
                        <Typography sx={{ fontSize: 12.5, color: '#fff' }}>{m.time}</Typography>
                        <Ticks status={m.status} color={tickColor} />
                      </Box>
                    </Box>
                  ) : (
                    <Box
                      sx={{
                        maxWidth: '78%',
                        display: 'flex',
                        flexDirection: 'column',
                        px: 1.25,
                        py: 0.65,
                        background: out ? tg.accent : incomingBg,
                        color: out ? '#fff' : tg.textPrimary,
                        borderRadius: out ? '15px 15px 0 15px' : '15px 15px 15px 0',
                      }}
                    >
                      {!out && m.sender && (
                        <Typography sx={{ fontSize: 14, fontWeight: 600, color: m.senderColor ?? tg.accent }}>
                          {m.sender}
                        </Typography>
                      )}
                      {m.reply && (
                        <Box
                          sx={{
                            mb: 0.5,
                            px: 1,
                            py: 0.5,
                            borderRadius: '6px',
                            borderLeft: `3px solid ${out ? '#fff' : tg.accent}`,
                            background: out ? 'rgba(255,255,255,0.15)' : 'rgba(135,116,225,0.12)',
                          }}
                        >
                          <Typography noWrap sx={{ fontSize: 13.5, fontWeight: 600, color: out ? '#fff' : tg.accent }}>
                            {m.reply.name}
                          </Typography>
                          <Typography noWrap sx={{ fontSize: 13.5, color: out ? 'rgba(255,255,255,0.85)' : tg.textSecondary, maxWidth: 240 }}>
                            {m.reply.text}
                          </Typography>
                        </Box>
                      )}
                      <Box sx={{ display: 'flex', flexWrap: 'wrap', alignItems: 'flex-end', gap: 0.75 }}>
                        <Typography component="span" sx={{ fontSize: 16, lineHeight: 1.35 }}>
                          {m.text}
                        </Typography>
                        <Box
                          sx={{
                            display: 'inline-flex',
                            alignItems: 'center',
                            gap: 0.25,
                            ml: 'auto',
                            transform: 'translateY(2px)',
                          }}
                        >
                          <Typography
                            component="span"
                            sx={{
                              fontSize: 12,
                              color: out ? 'rgba(255,255,255,0.8)' : tg.textFaint,
                              whiteSpace: 'nowrap',
                            }}
                          >
                            {m.time}
                          </Typography>
                          <Ticks status={m.status} color={tickColor} />
                        </Box>
                      </Box>
                    </Box>
                  )}
                </Box>
              )
            })}

            {typing && (
              <Box sx={{ display: 'flex', justifyContent: 'flex-start' }}>
                <Box
                  sx={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: 0.5,
                    px: 1.5,
                    py: 1.1,
                    background: incomingBg,
                    borderRadius: '15px 15px 15px 0',
                  }}
                >
                  {[0, 1, 2].map((d) => (
                    <Box
                      key={d}
                      component={motion.span}
                      animate={{ opacity: [0.3, 1, 0.3], y: [0, -2, 0] }}
                      transition={{ duration: 1, repeat: Infinity, delay: d * 0.18 }}
                      sx={{ width: 7, height: 7, borderRadius: '50%', background: tg.textSecondary }}
                    />
                  ))}
                </Box>
              </Box>
            )}
          </Box>
        </Box>

        {/* Footer */}
        {canType ? (
          <Box
            sx={{
              position: 'sticky',
              bottom: '16px',
              zIndex: 6,
              display: 'flex',
              alignItems: 'flex-end',
              gap: 1,
              width: '100%',
              maxWidth: 688,
              mx: 'auto',
              mt: 1,
            }}
          >
            {/* Composer container: reply section + input row in ONE box */}
            <Box
              sx={{
                flex: 1,
                minWidth: 0,
                display: 'flex',
                flexDirection: 'column',
                background: tg.bubble,
                borderRadius: '24px',
                overflow: 'hidden',
                boxShadow:
                  mode === 'dark'
                    ? '0 1px 8px 1px rgba(0,0,0,0.35)'
                    : '0 1px 8px 1px rgba(0,0,0,0.12)',
              }}
            >
              {/* Animated reply bar (inside the container) */}
              <AnimatePresence initial={false}>
                {reply && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.22, ease: [0.16, 1, 0.3, 1] }}
                    style={{ overflow: 'hidden' }}
                  >
                    <Box
                      sx={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: 1.5,
                        px: 1.5,
                        py: 1,
                        background:
                          mode === 'dark' ? 'rgba(135,116,225,0.13)' : 'rgba(125,99,232,0.10)',
                      }}
                    >
                      <ReplyRounded sx={{ color: tg.accent, fontSize: 22 }} />
                      <Box sx={{ flex: 1, minWidth: 0, borderLeft: `2px solid ${tg.accent}`, pl: 1.25 }}>
                        <Typography sx={{ fontSize: 14, fontWeight: 600, color: tg.accent }}>
                          Reply to {reply.name}
                        </Typography>
                        <Typography noWrap sx={{ fontSize: 14, color: tg.textSecondary }}>
                          {reply.text}
                        </Typography>
                      </Box>
                      <IconButton size="small" onClick={() => setReply(null)} sx={{ color: tg.textFaint }}>
                        <CloseRounded fontSize="small" />
                      </IconButton>
                    </Box>
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Input row */}
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5, minHeight: 48, pl: 0.5, pr: 0.5, py: 0.5 }}>
                <IconButton sx={{ width: 40, height: 40, color: tg.textSecondary }}>
                  <AttachFileRounded sx={{ transform: 'rotate(45deg)' }} />
                </IconButton>
                <InputBase
                  inputRef={inputRef}
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' && !e.shiftKey) {
                      e.preventDefault()
                      send()
                    }
                  }}
                  placeholder="Message"
                  sx={{
                    flex: 1,
                    fontSize: 16,
                    lineHeight: '21px',
                    color: tg.textPrimary,
                    '& input::placeholder': { color: tg.textFaint, opacity: 1 },
                  }}
                />
                <IconButton sx={{ width: 40, height: 40, color: tg.textSecondary }}>
                  <SentimentSatisfiedAltRounded />
                </IconButton>
                {/* Mic / Send — 48×40 rounded pill inside the bar (1:1 with TG .btn-send) */}
                <Box
                  component={motion.div}
                  onClick={send}
                  whileTap={{ scale: 0.92 }}
                  sx={{
                    width: 48,
                    height: 40,
                    flexShrink: 0,
                    borderRadius: '20px',
                    background: tg.accentGradient,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: '#fff',
                    cursor: 'pointer',
                  }}
                >
                  <AnimatePresence mode="wait" initial={false}>
                    <motion.span
                      key={hasText ? 'send' : 'mic'}
                      initial={{ scale: 0, opacity: 0 }}
                      animate={{ scale: 1, opacity: 1 }}
                      exit={{ scale: 0, opacity: 0 }}
                      transition={{ duration: 0.13 }}
                      style={{ display: 'inline-flex' }}
                    >
                      {hasText ? <SendRounded /> : <KeyboardVoiceRounded />}
                    </motion.span>
                  </AnimatePresence>
                </Box>
              </Box>
            </Box>
          </Box>
        ) : (
          <Box
            sx={{
              position: 'sticky',
              bottom: '16px',
              zIndex: 6,
              display: 'flex',
              alignItems: 'center',
              gap: 1,
              width: '100%',
              maxWidth: 688,
              mx: 'auto',
              mt: 1,
              py: 0,
            }}
          >
            <Box
              component={motion.div}
              whileTap={{ scale: 0.995 }}
              sx={{
                flex: 1,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: 1,
                background: tg.bubble,
                borderRadius: '14px',
                py: 1.5,
                cursor: 'pointer',
                color: tg.textPrimary,
              }}
            >
              <VolumeOffRounded sx={{ fontSize: 20, color: tg.textSecondary }} />
              <Typography sx={{ fontWeight: 600, fontSize: 15.5 }}>Mute</Typography>
            </Box>
            <Box
              sx={{
                width: 52,
                height: 52,
                borderRadius: '14px',
                background: tg.bubble,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                cursor: 'pointer',
              }}
            >
              <CardGiftcardRounded sx={{ color: tg.textSecondary }} />
            </Box>
          </Box>
        )}
      </Box>

      {/* Info panel (private / group / channel) */}
      <AnimatePresence>
        {infoOpen && <UserInfoPanel chat={chat} onClose={() => setInfoOpen(false)} />}
      </AnimatePresence>

      {/* Header "⋮" menu */}
      {headerMenu && (
        <HeaderMenu chat={chat} anchor={headerMenu} onClose={() => setHeaderMenu(null)} />
      )}

      {/* Message context menu — reactions strip + actions */}
      {msgMenu &&
        createPortal(
          <>
            <Box
              onClick={() => setMsgMenu(null)}
              onContextMenu={(e) => {
                e.preventDefault()
                setMsgMenu(null)
              }}
              sx={{ position: 'fixed', inset: 0, zIndex: 2000 }}
            />
            <Box sx={{ position: 'fixed', top: msgMenu.y, left: msgMenu.x, zIndex: 2001, display: 'flex', flexDirection: 'column', gap: 1, transformOrigin: 'top left' }}>
              {/* Reactions */}
              <Box
                component={motion.div}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.13, ease: [0.16, 1, 0.3, 1] }}
                sx={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 0.5,
                  alignSelf: 'flex-start',
                  px: 1,
                  py: 0.5,
                  borderRadius: '24px',
                  background: tg.menuBg,
                  backdropFilter: 'blur(22px)',
                  WebkitBackdropFilter: 'blur(22px)',
                  boxShadow: tg.menuShadow,
                }}
              >
                {REACTIONS.map((r) => (
                  <Box
                    key={r}
                    component={motion.div}
                    whileHover={{ scale: 1.25 }}
                    whileTap={{ scale: 0.9 }}
                    onClick={() => setMsgMenu(null)}
                    sx={{ fontSize: 24, lineHeight: 1, cursor: 'pointer', px: 0.25 }}
                  >
                    {r}
                  </Box>
                ))}
                <KeyboardArrowDownRounded sx={{ color: tg.textSecondary, fontSize: 22, ml: 0.25 }} />
              </Box>

              {/* Actions */}
              <Box
                component={motion.div}
                initial={{ opacity: 0, scale: 0.92 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.13, ease: [0.16, 1, 0.3, 1] }}
                sx={{
                  minWidth: 220,
                  py: 0.75,
                  borderRadius: '12px',
                  background: tg.menuBg,
                  backdropFilter: 'blur(22px)',
                  WebkitBackdropFilter: 'blur(22px)',
                  boxShadow: tg.menuShadow,
                  transformOrigin: 'top left',
                }}
              >
                {msgMenuItems.map((it) => (
                  <Box
                    key={it.label}
                    onClick={() => (it.onClick ? it.onClick() : setMsgMenu(null))}
                    sx={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: 1.5,
                      px: 1.5,
                      py: 0.65,
                      mx: 0.5,
                      borderRadius: '8px',
                      cursor: 'pointer',
                      '&:hover': { background: tg.hover },
                    }}
                  >
                    <Box sx={{ display: 'flex', color: it.danger ? '#ff595a' : tg.textSecondary, '& svg': { fontSize: 20 } }}>
                      {it.icon}
                    </Box>
                    <Typography sx={{ fontSize: 15, color: it.danger ? '#ff595a' : tg.textPrimary }}>
                      {it.label}
                    </Typography>
                  </Box>
                ))}
              </Box>
            </Box>
          </>,
          document.body
        )}
    </Box>
  )
}
