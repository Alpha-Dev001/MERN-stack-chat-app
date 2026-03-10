import React, { createContext, useContext, useState, useEffect } from 'react'
import { messagesAPI } from '../lib/api'
import { useSocketContext } from './SocketContext'
import { useAuthContext } from './AuthContext'

const ChatContext = createContext()

export const useChatContext = () => {
    return useContext(ChatContext)
}

export const ChatContextProvider = ({ children }) => {
    const [messages, setMessages] = useState([])
    const [loading, setLoading] = useState(false)
    const [selectedUser, setSelectedUser] = useState(null)
    const { socket } = useSocketContext()
    const { authUser } = useAuthContext()

    useEffect(() => {
        if (socket) {
            socket.on('newMessage', (newMessage) => {
                if (!selectedUser) return

                const selectedId = String(selectedUser._id)
                const senderId = String(newMessage.senderId)
                const receiverId = String(newMessage.receiverId)

                if (senderId === selectedId || receiverId === selectedId) {
                    setMessages(prev => [...prev, newMessage])
                }
            })

            return () => {
                socket.off('newMessage')
            }
        }
    }, [socket, selectedUser])

    const fetchMessages = async (userId) => {
        try {
            setLoading(true)
            const res = await messagesAPI.getMessages(userId)
            if (res.data.success) {
                setMessages(res.data.messages)
            }
        } catch (error) {
            console.error('Failed to fetch messages:', error)
        } finally {
            setLoading(false)
        }
    }

    const sendMessage = async (messageData) => {
        if (!selectedUser) return

        try {
            const res = await messagesAPI.sendMessage(selectedUser._id, messageData)
            if (res.data.success) {
                setMessages(prev => [...prev, res.data.newMessage])
                return { success: true }
            }
            return { success: false, message: res.data.message }
        } catch (error) {
            console.error('Failed to send message:', error)
            return {
                success: false,
                message: error.response?.data?.message || 'Failed to send message'
            }
        }
    }

    const selectUser = (user) => {
        setSelectedUser(user)
        if (user) {
            fetchMessages(user._id)
        } else {
            setMessages([])
        }
    }

    return (
        <ChatContext.Provider value={{
            messages,
            loading,
            selectedUser,
            sendMessage,
            selectUser,
            fetchMessages
        }}>
            {children}
        </ChatContext.Provider>
    )
}
