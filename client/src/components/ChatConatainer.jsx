import React, { useEffect, useRef, useState } from 'react'
import assets from '../assets/assets'
import { formatMessageTime } from '../lib/utils'
import { useChatContext } from '../context/ChatContext'
import { useAuthContext } from '../context/AuthContext'
import toast from 'react-hot-toast'

function ChatConatainer({ selectedUser, setSelectedUser }) {
  const scrollEnd = useRef()
  const [text, setText] = useState('')
  const [image, setImage] = useState(null)
  const [sending, setSending] = useState(false)

  const { messages, loading, sendMessage } = useChatContext()
  const { authUser } = useAuthContext()

  useEffect(() => {
    if (scrollEnd.current) {
      scrollEnd.current.scrollIntoView({ behavior: 'smooth' })
    }
  }, [messages])

  const handleSendMessage = async (e) => {
    e.preventDefault()
    if (!text.trim() && !image) return

    setSending(true)
    const messageData = { text: text.trim() }

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

  const handleSendResult = (result) => {
    setSending(false)
    if (result.success) {
      setText('')
      setImage(null)
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

  return selectedUser ? (
    <div className='h-full overflow-scroll relative backdrop-blur-lg'>
      {/*----- header -----*/}
      <div className='flex items-center gap-3 py-3 mx-4 border-b border-stone-500'>
        <img src={selectedUser?.profilePic || assets.avatar_icon} alt="" className='w-8 rounded-full' />
        <p className='flex-1 text-lg text-white flex items-center gap-2'>{selectedUser?.fullName || 'User'}
          <span className='w-2 h-2 rounded-full bg-green-500'></span>
        </p>
        <img onClick={() => {
          setSelectedUser(null)
        }} src={assets.arrow_icon} alt="" className='md:hidden max-w-7' />
        <img src={assets.help_icon} alt="" className='max-md:hidden max-w-5' />
      </div>

      {/*----- messages area -----*/}
      <div className='flex flex-col h-[calc(100%-120px)] overflow-y-scroll p-3 pb-6'>
        {loading ? (
          <div className='flex justify-center items-center h-full'>
            <div className='text-white'>Loading messages...</div>
          </div>
        ) : (
          <>
            {messages.map((msg, index) => (
              <div key={index} className={`flex items-end gap-2 justify-end ${msg.senderId !== authUser._id && 'flex-row-reverse'}`}>
                {msg.image ? (
                  <img src={msg.image} alt='' className='max-w-[230px] rounded-lg border 
                          border-gray-700 rounded-lg overflow-hidden mb-8'/>
                ) : (
                  <p className={`p-2 max-w-[200px] md:text-sm font-light rounded-lg mb-8 break-all bg-violet-500/30 text-white 
                    ${msg.senderId === authUser._id ? 'rounded-br-none' : 'rounded-bl-none'}`}>{msg.text}</p>
                )}
                <div className='text-center text-xs'>
                  <img src={msg.senderId === authUser._id ? assets.avatar_icon : (selectedUser?.profilePic || assets.avatar_icon)} alt=""
                    className='rounded-full w-7' />
                  <p className='text-gray-500'>{formatMessageTime(msg.createdAt)}</p>
                </div>
              </div>
            ))}
          </>
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
            onChange={(e) => setText(e.target.value)}
            className='flex-1 text-sm p-3 border-none rounded-lg outline-none text-white placeholder-gray-400'
          />
          <input type="file" id='image' accept='image/png, image/jpeg' onChange={handleImageChange} hidden />
          <label htmlFor="image">
            <img src={assets.gallery_icon} alt="" className='w-5 mr-2 cursor-pointer' />
          </label>
        </div>
        <button
          type='submit'
          disabled={sending || (!text.trim() && !image)}
          className='w-7 h-7 cursor-pointer disabled:opacity-50'
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
