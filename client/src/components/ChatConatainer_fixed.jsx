import React, { useEffect, useRef, useState } from 'react'
import assets from '../assets/assets'
import { formatMessageTime } from '../lib/utils'
import { useChatContext } from '../context/ChatContext'
import { useAuthContext } from '../context/AuthContext'
import { useSocketContext } from '../context/SocketContext'
import toast from 'react-hot-toast'
import { MessageSkeleton, ChatSkeleton } from './LoadingSkeleton'
import MessageSearch from './MessageSearch'

function ChatConatainer({ selectedUser, setSelectedUser }) {
  const scrollEnd = useRef()
  const [text, setText] = useState('')
  const [image, setImage] = useState(null)
  const [sending, setSending] = useState(false)

  const { messages, loading, sendMessage, deleteMessage, searchResults, isSearching, searchMessages, clearSearch } = useChatContext()
  const { authUser, onlineUsers } = useSocketContext()
  const { typingUsers, emitTyping, emitStopTyping } = useSocketContext()
  const typingTimeoutRef = useRef()

  useEffect(() => {
    if (scrollEnd.current) {
      scrollEnd.current.scrollIntoView({ behavior: 'smooth' })
    }
  }, [messages])

  // Auto-scroll for new messages - optimized for instant display
  useEffect(() => {
    const scrollContainer = document.querySelector('[data-scroll-container]')
    if (scrollContainer && messages.length > 0) {
      const lastMessage = messages[messages.length - 1]
      // Check if this is a newly added message (within last 1 second)
      const messageTime = new Date(lastMessage.createdAt)
      const now = new Date()
      const timeDiff = (now - messageTime) / 1000
      
      if (timeDiff < 1) {
        // Use requestAnimationFrame for smooth, instant scrolling
        requestAnimationFrame(() => {
          scrollContainer.scrollTop = scrollContainer.scrollHeight
        })
      }
    }
  }, [messages])

  useEffect(() => {
    return () => {
      if (typingTimeoutRef.current) {
        clearTimeout(typingTimeoutRef.current)
      }
    }
  }, [])

  const handleSendMessage = async (e) => {
    e.preventDefault()
    if (!text.trim() && !image) return

    if (selectedUser) {
      emitStopTyping(selectedUser._id)
    }

    // Clear input immediately for instant feedback
    const messageText = text.trim()
    setText('')

    // Clear input field immediately
    const inputElement = document.querySelector('input[type="text"]')
    if (inputElement) {
      inputElement.value = ''
    }

    const messageData = { text: messageText }
    setSending(true)

    if (image) {
      const reader = new FileReader()
      reader.onload = async () => {
        messageData.image = reader.result
        const result = await sendMessage(messageData)
        handleSendResult(result)
      }
      reader.readAsDataURL(image)
    } else {
      const result = await sendMessage(messageData)
      handleSendResult(result)
    }
  }

  const handleTextChange = (e) => {
    const newText = e.target.value
    setText(newText)

    if (newText.trim() && selectedUser) {
      emitTyping(selectedUser._id)

      // Clear existing timeout
      if (typingTimeoutRef.current) {
        clearTimeout(typingTimeoutRef.current)
      }

      // Set new timeout to stop typing indicator after 1 second of inactivity
      typingTimeoutRef.current = setTimeout(() => {
        if (selectedUser) {
          emitStopTyping(selectedUser._id)
        }
      }, 1000)
    } else if (!newText.trim() && selectedUser) {
      emitStopTyping(selectedUser._id)
    }
  }

  const handleSendResult = (result) => {
    setSending(false)
    if (result.success) {
      setText('')
      setImage(null)
      // Clear input immediately for better UX
      const inputElement = document.querySelector('input[type="text"]')
      if (inputElement) {
        inputElement.value = ''
      }
    } else {
      toast.error(result.message || 'Failed to send message')
    }
  }

  const handleImageChange = (e) => {
    const file = e.target.files[0]
    if (file) {
      setImage(file)
    }
  }

  const handleDeleteMessage = async (messageId) => {
    const result = await deleteMessage(messageId)
    if (!result.success) {
      toast.error(result.message || 'Failed to delete message')
    }
  }

  return selectedUser ? (
    <div className='h-full overflow-scroll relative backdrop-blur-lg'>
      {/*----- header -----*/}
      <div className='flex items-center gap-3 py-3 mx-4 border-b border-stone-500'>
        <img src={selectedUser?.profilePic || assets.avatar_icon} alt="" className='w-8 rounded-full' />
        <p className='flex-1 text-lg text-white flex items-center gap-2'>{selectedUser?.fullName || 'User'}
          <span className={`w-2.5 h-2.5 rounded-full ${selectedUser && onlineUsers.includes(selectedUser._id)
            ? 'bg-green-500 shadow-green-500/50 shadow-lg'
            : 'bg-gray-400'
            }`}></span>
        </p>
        <img onClick={() => {
          setSelectedUser(null)
          clearSearch()
        }} src={assets.arrow_icon} alt="" className='md:hidden max-w-7' />
        <img src={assets.help_icon} alt="" className='max-md:hidden max-w-5' />
      </div>

      {/*----- Search bar -----*/}
      <MessageSearch
        selectedUser={selectedUser}
        onSearch={searchMessages}
        onClear={clearSearch}
        isSearching={isSearching}
      />

      {/*----- messages area -----*/}
      <div className='flex flex-col h-[calc(100%-120px)] overflow-y-scroll p-3 pb-6' data-scroll-container>
        {loading ? (
          <div className='space-y-4'>
            {[...Array(3)].map((_, index) => (
              <MessageSkeleton key={index} />
            ))}
          </div>
        ) : searchResults.length > 0 ? (
          <>
            <div className="text-center text-gray-400 text-sm mb-4 p-2 bg-violet-600/20 rounded-lg">
              Found {searchResults.length} messages
            </div>
            {searchResults.map((msg, index) => (
              <div key={index} className={`flex items-end gap-3 mb-4 ${
                authUser && msg.senderId === authUser._id
                  ? 'flex-row-reverse justify-end'
                  : 'flex-row justify-start'
              }`}>
                {/* Profile Picture */}
                <div className='flex flex-col items-center gap-1 min-w-[40px]'>
                  <img src={
                    authUser && msg.senderId === authUser._id
                      ? authUser.profilePic || assets.avatar_icon
                      : selectedUser?.profilePic || assets.avatar_icon
                  } alt={`${authUser && msg.senderId === authUser._id ? 'You' : selectedUser?.fullName || 'User'}`}
                    className='rounded-full w-8 h-8 border-2 border-gray-600/30' />
                  <p className='text-gray-400 text-xs font-medium'>{formatMessageTime(msg.createdAt)}</p>
                </div>

                {/* Message Content */}
                <div className={`max-w-[70%] ${
                  authUser && msg.senderId === authUser._id
                    ? 'flex-col items-end'
                    : 'flex-col items-start'
                }`}>
                  {msg.image ? (
                    <div className="relative group">
                      <img src={msg.image} alt='Image message' className='max-w-full rounded-lg border 
                              border-gray-700 rounded-lg overflow-hidden shadow-lg' />
                      {authUser && msg.senderId === authUser._id && (
                        <button
                          onClick={() => handleDeleteMessage(msg._id)}
                          className="absolute top-2 right-2 bg-red-500/90 hover:bg-red-600 text-white p-1.5 rounded-full opacity-0 group-hover:opacity-100 transition-all duration-200 shadow-lg"
                          title="Delete message"
                        >
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                          </svg>
                        </button>
                      )}
                    </div>
                  ) : (
                    <div className="relative group">
                      <p className={`p-3 md:text-sm font-normal rounded-lg break-all shadow-md bg-violet-600/30 text-white rounded-br-none border border-violet-700/30`}>
                        <span className="text-yellow-300 text-xs">"{searchResults.find(m => m._id === msg._id)?.text.split('').join('')}"</span>
                      </p>
                      {authUser && msg.senderId === authUser._id && (
                        <button
                          onClick={() => handleDeleteMessage(msg._id)}
                          className="absolute -top-1 -right-1 bg-red-500/90 hover:bg-red-600 text-white p-1 rounded-full opacity-0 group-hover:opacity-100 transition-all duration-200 shadow-lg"
                          title="Delete message"
                        >
                          <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                          </svg>
                        </button>
                      )}
                    </div>
                  )}
                </div>
              </div>
            ))}
          </>
        ) : (
          <>
            {searchResults.length === 0 && isSearching === false && searchResults !== undefined && (
              <div className="text-center text-gray-400 text-sm mt-8">
                No messages found
              </div>
            )}
            {messages.map((msg, index) => {
              const isCurrentUser = authUser && msg.senderId === authUser._id;
              return (
              <div key={index} className={`flex items-end gap-3 mb-4 ${
                isCurrentUser
                  ? 'flex-row-reverse justify-end'
                  : 'flex-row justify-start'
              } message-enter message-hover`}>
                {/* Profile Picture */}
                <div className='flex flex-col items-center gap-1 min-w-[40px]'>
                  <img src={
                    isCurrentUser
                      ? authUser.profilePic || assets.avatar_icon
                      : msg.senderId === selectedUser?._id
                        ? selectedUser?.profilePic || assets.avatar_icon
                        : assets.avatar_icon // Fallback for other users
                  } alt={isCurrentUser ? 'You' : msg.senderId === selectedUser?._id ? selectedUser?.fullName || 'User' : 'User'}
                    className='rounded-full w-8 h-8 border-2 border-gray-600/30' />
                  <p className='text-gray-400 text-xs font-medium'>{formatMessageTime(msg.createdAt)}</p>
                </div>
                
                {/* Message Content */}
                <div className={`max-w-[70%] ${
                  isCurrentUser
                    ? 'flex-col items-end'
                    : 'flex-col items-start'
                }`}>
                  {msg.image ? (
                    <div className="relative group">
                      <img src={msg.image} alt='Image message' className='max-w-full rounded-lg border 
                              border-gray-700 rounded-lg overflow-hidden shadow-lg' />
                      {isCurrentUser && (
                        <button
                          onClick={() => handleDeleteMessage(msg._id)}
                          className="absolute top-2 right-2 bg-red-500/90 hover:bg-red-600 text-white p-1.5 rounded-full opacity-0 group-hover:opacity-100 transition-all duration-200 shadow-lg"
                          title="Delete message"
                        >
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                          </svg>
                        </button>
                      )}
                    </div>
                  ) : (
                    <div className="relative group">
                      <p className={`p-3 md:text-sm font-normal rounded-lg break-all shadow-md ${
                        isCurrentUser
                          ? 'bg-blue-500 text-white rounded-br-none border border-blue-600/30'
                          : 'bg-gray-700 text-white rounded-bl-none border border-gray-600/30'
                      }`}>{msg.text}</p>
                      {isCurrentUser && (
                        <button
                          onClick={() => handleDeleteMessage(msg._id)}
                          className="absolute -top-1 -right-1 bg-red-500/90 hover:bg-red-600 text-white p-1 rounded-full opacity-0 group-hover:opacity-100 transition-all duration-200 shadow-lg"
                          title="Delete message"
                        >
                          <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                          </svg>
                        </button>
                      )}
                    </div>
                  )}
                  
                  {/* Message status indicator for sent messages */}
                  {isCurrentUser && (
                    <div className="flex items-center gap-1 mt-1 text-xs">
                      {msg.seen ? (
                        <span className="text-blue-400">Seen</span>
                      ) : (
                        <span className="text-gray-500">Sent</span>
                      )}
                    </div>
                  )}
                </div>
              </div>
            )}
          </>
        )}

        {/* Typing Indicator */}
        {selectedUser && typingUsers.has(selectedUser._id) && (
          <div className="flex items-center gap-2 p-2 text-gray-400 text-sm message-enter">
            <img src={selectedUser?.profilePic || assets.avatar_icon} alt="" className='w-6 h-6 rounded-full' />
            <div className="flex gap-1">
              <div className="w-2 h-2 bg-gray-400 rounded-full typing-dot"></div>
              <div className="w-2 h-2 bg-gray-400 rounded-full typing-dot"></div>
              <div className="w-2 h-2 bg-gray-400 rounded-full typing-dot"></div>
            </div>
            <span className="text-xs">typing...</span>
          </div>
        )}

        <div ref={scrollEnd}></div>
      </div>

      {/* bottom area */}
      <form onSubmit={handleSendMessage} className='absolute bottom-0 left-0 right-0 flex items-center gap-3 p-3'>
        <div className='flex-1 flex items-center bg-gray-100/12 px-3 rounded-full'>
          <input
            type="text"
            placeholder='Send a message'
            value={text}
            onChange={handleTextChange}
            className='flex-1 text-sm p-3 border-none rounded-lg outline-none text-white placeholder-gray-400 input-field'
          />
          <input type="file" id='image' accept='image/png, image/jpeg' onChange={handleImageChange} hidden />
          <label htmlFor="image">
            <img src={assets.gallery_icon} alt="" className='w-5 mr-2 cursor-pointer' />
          </label>
        </div>
        <button
          type='submit'
          disabled={sending || (!text.trim() && !image)}
          className='w-7 h-7 cursor-pointer disabled:opacity-50 btn-primary'
        >
          <img src={assets.send_button} alt="" className='w-full h-full' />
        </button>
      </form>
    </div>
  ) : (
    <div className='flex flex-col items-center justify-center gap-2 text-gray-500 bg-white/10 max-md:hidden'>
      <img src={assets.logo_icon} className='max-w-16' alt="" />
      <p className='text-lg font-medium text-white'>Chat anytime, anywhere</p>
    </div>
  )
}

export default ChatConatainer
