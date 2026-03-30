import React, { useEffect, useState, useRef } from 'react'
import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'
import { useSelector, useDispatch } from 'react-redux'
import { useChat } from '../hooks/useChat'
import { useAuth } from '../../auth/hooks/useAuth'
import { setCurrentChatId } from '../chat.slice'

const Dashboard = () => {
  const chatHook = useChat();
  const authHook = useAuth();
  const dispatch = useDispatch()

  const [showLogoutModal, setShowLogoutModal] = useState(false)

  const [chatInput, setChatInput] = useState('')
  const [isDark, setIsDark] = useState(() => {
    return localStorage.getItem('theme') !== 'light'
  })
  const [sidebarOpen, setSidebarOpen] = useState(false)

  const chats = useSelector((state) => state.chat.chats)
  const currentChatId = useSelector((state) => state.chat.currentChatId)
  const isLoading = useSelector((state) => state.chat.loading)

  const messagesEndRef = useRef(null)

  // Init 
  useEffect(() => {
    chatHook.initializeSocketConnection()
    chatHook.handleGetChats()
  }, [])

  // Auto-scroll on new messages 
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [chats[currentChatId]?.messages?.length])

  // Persist theme 
  useEffect(() => {
    localStorage.setItem('theme', isDark ? 'dark' : 'light')
  }, [isDark])

  // Handlers 
  const handleSubmitMessage = (e) => {
    e.preventDefault()
    const trimmedMessage = chatInput.trim()
    if (!trimmedMessage || isLoading) return
    chatHook.handleSendMessage({ message: trimmedMessage, chatId: currentChatId })
    setChatInput('')
  }

  const openChat = (chatId) => {
    chatHook.handleOpenChat(chatId, chats)
    setSidebarOpen(false)
  }

  const handleNewChat = () => {
    dispatch(setCurrentChatId(null))
    setSidebarOpen(false)
  }

  // Derived state 
  const messages = currentChatId ? (chats[currentChatId]?.messages ?? []) : []
  const lastMessage = messages[messages.length - 1]
  // Show dots only while waiting for AI's first token (before streaming starts)
  const showTypingIndicator = isLoading && (!lastMessage || lastMessage.role === 'user')

  // Theme tokens 
  const t = isDark
    ? {
      pageBg: 'bg-[#07090f]',
      surfaceBg: 'bg-[#080b12]',
      text: 'text-white',
      textMuted: 'text-white/50',
      border: 'border-white/10',
      borderInput: 'border-white/30',
      hoverBg: 'hover:bg-white/8',
      activeSidebar: 'bg-white/8 border-white/40',
      userBubble: 'bg-white/12 text-white',
      codeBg: 'bg-white/10',
      preBg: 'bg-black/30',
      btnHover: 'hover:bg-white/10',
      inputPlaceholder: 'placeholder:text-white/40',
      dotColor: 'bg-white/35',
    }
    : {
      pageBg: 'bg-gray-100',
      surfaceBg: 'bg-white',
      text: 'text-gray-900',
      textMuted: 'text-gray-400',
      border: 'border-gray-200',
      borderInput: 'border-gray-300',
      hoverBg: 'hover:bg-gray-50',
      activeSidebar: 'bg-gray-100 border-gray-400',
      userBubble: 'bg-gray-200 text-gray-900',
      codeBg: 'bg-gray-100',
      preBg: 'bg-gray-100',
      btnHover: 'hover:bg-gray-100',
      inputPlaceholder: 'placeholder:text-gray-400',
      dotColor: 'bg-gray-400',
    }

  // Render 
  return (
    <main className={`min-h-screen w-full ${t.pageBg} p-3 ${t.text} md:p-5 transition-colors duration-200`}>

      {/* Mobile overlay backdrop */}
      {sidebarOpen && (
        <div
          className='fixed inset-0 z-40 bg-black/50 md:hidden'
          onClick={() => setSidebarOpen(false)}
        />
      )}

      <section className='mx-auto flex h-[calc(100vh-1.5rem)] w-full gap-4 md:h-[calc(100vh-2.5rem)] md:gap-6'>

        {/* Sidebar */}
        <aside className={`
          fixed inset-y-0 left-0 z-50 w-72 ${t.surfaceBg} border-r ${t.border} p-4
          flex flex-col transition-transform duration-300 ease-in-out
          md:static md:h-full md:rounded-3xl md:border md:translate-x-0
          ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'}
        `}>
          {/* Sidebar header */}
          <div className='flex items-center justify-between mb-5'>
            <h1 className='text-2xl font-semibold tracking-tight'>Perplexity</h1>
            <button
              onClick={() => setSidebarOpen(false)}
              className={`md:hidden p-1.5 rounded-lg ${t.btnHover} transition`}
              aria-label='Close sidebar'
            >
              <svg width='16' height='16' viewBox='0 0 16 16' fill='none'>
                <path d='M2 2l12 12M14 2L2 14' stroke='currentColor' strokeWidth='2' strokeLinecap='round' />
              </svg>
            </button>
          </div>

          {/* New Chat button */}
          <button
            onClick={handleNewChat}
            className={`w-full mb-4 flex items-center gap-2 rounded-xl border ${t.border} px-3 py-2.5
              text-sm font-medium transition ${t.btnHover} ${!currentChatId ? t.activeSidebar : ''}`}
          >
            <svg width='15' height='15' viewBox='0 0 15 15' fill='none'>
              <path d='M7.5 2v11M2 7.5h11' stroke='currentColor' strokeWidth='2' strokeLinecap='round' />
            </svg>
            New Chat
          </button>

          {/* Chat list */}
          <div className='flex-1 overflow-y-auto space-y-1.5 messages'>
            {Object.values(chats).map((chatItem) => (
              <button
                key={chatItem.id}
                onClick={() => openChat(chatItem.id)}
                type='button'
                className={`w-full cursor-pointer rounded-xl border px-3 py-2 text-left text-sm
                  font-medium transition truncate
                  ${currentChatId === chatItem.id
                    ? t.activeSidebar
                    : `${t.border} bg-transparent ${t.hoverBg}`
                  }`}
              >
                {chatItem.title}
              </button>
            ))}
          </div>

          {/* logout button in sidebar bottom */}
          <div className={`mt-4 pt-4 border-t ${t.border}`}>
            <button
              onClick={() => setShowLogoutModal(true)}  // 👈 changed
              className={`w-full flex items-center gap-2 rounded-xl border ${t.border} px-3 py-2.5
        text-sm font-medium transition ${t.btnHover} text-red-400 hover:text-red-500
        hover:border-red-400/40`}
            >
              <svg width='15' height='15' viewBox='0 0 24 24' fill='none'>
                <path
                  d='M9 21H5a2 2 0 01-2-2V5a2 2 0 012-2h4M16 17l5-5-5-5M21 12H9'
                  stroke='currentColor' strokeWidth='2' strokeLinecap='round' strokeLinejoin='round'
                />
              </svg>
              Logout
            </button>
          </div>
        </aside>

        {/* Main area :-*/}
        <section className='flex flex-1 min-w-0 flex-col gap-3'>

          {/* Top bar: hamburger (mobile) + theme toggle (always) */}
          <div className='flex items-center justify-between px-1'>
            <button
              onClick={() => setSidebarOpen(true)}
              className={`md:hidden p-2 rounded-xl border ${t.border} ${t.btnHover} transition`}
              aria-label='Open sidebar'
            >
              <svg width='18' height='18' viewBox='0 0 18 18' fill='none'>
                <path d='M2 4h14M2 9h14M2 14h14' stroke='currentColor' strokeWidth='2' strokeLinecap='round' />
              </svg>
            </button>
            <div className='flex-1' />
            {/* Theme toggle */}
            <button
              onClick={() => setIsDark(!isDark)}
              className={`flex items-center gap-2 rounded-xl border ${t.border} px-4 py-2
                text-sm font-medium transition ${t.btnHover}`}
              aria-label='Toggle theme'
            >
              {isDark ? (
                <>
                  <svg width='14' height='14' viewBox='0 0 24 24' fill='none'>
                    <circle cx='12' cy='12' r='5' stroke='currentColor' strokeWidth='2' />
                    <path d='M12 2v2M12 20v2M2 12h2M20 12h2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M4.93 19.07l1.41-1.41M17.66 6.34l1.41-1.41'
                      stroke='currentColor' strokeWidth='2' strokeLinecap='round' />
                  </svg>
                  Light
                </>
              ) : (
                <>
                  <svg width='14' height='14' viewBox='0 0 24 24' fill='none'>
                    <path d='M21 12.79A9 9 0 1111.21 3 7 7 0 0021 12.79z' stroke='currentColor' strokeWidth='2' strokeLinecap='round' strokeLinejoin='round' />
                  </svg>
                  Dark
                </>
              )}
            </button>
          </div>

          {/* Chat panel: messages + input as flex column */}
          <div className={`flex flex-col flex-1 min-h-0 rounded-3xl border ${t.border} ${t.surfaceBg} overflow-hidden`}>

            {/* Messages */}
            <div className='messages flex-1 overflow-y-auto p-4 space-y-3'>

              {/* Empty state */}
              {messages.length === 0 && !showTypingIndicator && (
                <div className='flex flex-col items-center justify-center h-full gap-2 select-none'>
                  <h2 className={`text-6xl mb-15 font-light tracking-tight 
                    md:text-6xl md:mb-15 
                    lg:text-7xl lg:mb-11 ${t.text}`}>
                    Perplexity Clone
                  </h2>
                  <p className={`text-2xl font-normal ${t.text}`}>What do you want to know?</p>
                  <p className={`text-sm ${t.textMuted}`}>Type a message below to get started.</p>
                </div>
              )}

              {/* Message bubbles */}
              {messages.map((message, index) => (
                <div
                  key={index}
                  className={`max-w-[82%] w-fit rounded-2xl px-4 py-3 text-sm md:text-base
                    ${message.role === 'user'
                      ? `ml-auto rounded-br-none ${t.userBubble}`
                      : `mr-auto ${isDark ? 'text-white/90' : 'text-gray-800'}`
                    }`}
                >
                  {message.role === 'user' ? (
                    <p>{message.content}</p>
                  ) : (
                    <ReactMarkdown
                      components={{
                        p: ({ children }) => <p className='mb-2 last:mb-0'>{children}</p>,
                        ul: ({ children }) => <ul className='mb-2 list-disc pl-5'>{children}</ul>,
                        ol: ({ children }) => <ol className='mb-2 list-decimal pl-5'>{children}</ol>,
                        code: ({ children }) => (
                          <code className={`rounded ${t.codeBg} px-1 py-0.5 text-sm font-mono`}>{children}</code>
                        ),
                        pre: ({ children }) => (
                          <pre className={`mb-2 overflow-x-auto rounded-xl ${t.preBg} p-3`}>{children}</pre>
                        ),
                      }}
                      remarkPlugins={[remarkGfm]}
                    >
                      {message.content}
                    </ReactMarkdown>
                  )}
                </div>
              ))}

              {/* Typing indicator — only while waiting for AI's first token */}
              {showTypingIndicator && (
                <div className='mr-auto flex items-center gap-1.5 px-4 py-3'>
                  {[0, 150, 300].map((delay) => (
                    <span
                      key={delay}
                      className={`w-2 h-2 rounded-full ${t.dotColor} animate-bounce`}
                      style={{ animationDelay: `${delay}ms` }}
                    />
                  ))}
                </div>
              )}

              {/* Scroll anchor */}
              <div ref={messagesEndRef} />
            </div>

            {/* Footer — sibling to messages, not absolute */}
            <footer className={`shrink-0 border-t ${t.border} p-4 md:p-5`}>
              <form onSubmit={handleSubmitMessage} className='flex flex-col gap-3 md:flex-row'>
                <input
                  type='text'
                  value={chatInput}
                  onChange={(e) => setChatInput(e.target.value)}
                  placeholder='Type your message...'
                  className={`w-full rounded-2xl border ${t.borderInput} bg-transparent px-4 py-3
                    text-base ${t.text} outline-none transition ${t.inputPlaceholder}
                    focus:border-opacity-90`}
                />
                <button
                  type='submit'
                  disabled={!chatInput.trim() || isLoading}
                  className={`rounded-2xl border ${t.border} px-6 py-3 text-base font-semibold
                    ${t.text} transition ${t.btnHover} disabled:cursor-not-allowed disabled:opacity-40`}
                >
                  Send
                </button>
              </form>
            </footer>
          </div>

        </section>
      </section>

      {showLogoutModal && (
        <div className='fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm'>
          <div className={`${t.surfaceBg} border ${t.border} rounded-2xl p-6 w-80 shadow-xl`}>

            {/* Icon */}
            <div className='flex items-center justify-center w-11 h-11 rounded-full bg-red-400/10 mb-4'>
              <svg width='20' height='20' viewBox='0 0 24 24' fill='none'>
                <path
                  d='M9 21H5a2 2 0 01-2-2V5a2 2 0 012-2h4M16 17l5-5-5-5M21 12H9'
                  stroke='#f87171' strokeWidth='2' strokeLinecap='round' strokeLinejoin='round'
                />
              </svg>
            </div>

            {/* Text */}
            <h2 className={`text-base font-semibold mb-1 ${t.text}`}>Logout</h2>
            <p className={`text-sm mb-6 ${t.textMuted}`}>Are you sure you want to log out?</p>

            {/* Buttons */}
            <div className='flex gap-3'>
              <button
                onClick={() => setShowLogoutModal(false)}
                className={`flex-1 rounded-xl border ${t.border} px-4 py-2.5 text-sm
                        font-medium transition ${t.btnHover} ${t.text}`}
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  setShowLogoutModal(false)
                  authHook.handleLogout()
                }}
                className='flex-1 rounded-xl bg-red-500 hover:bg-red-600 px-4 py-2.5
                        text-sm font-medium text-white transition'
              >
                Logout
              </button>
            </div>

          </div>
        </div>
      )}
    </main>
  )
}

export default Dashboard