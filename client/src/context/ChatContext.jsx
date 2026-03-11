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
    const [searchResults, setSearchResults] = useState([])
    const [isSearching, setIsSearching] = useState(false)
    const { socket } = useSocketContext()
    const { authUser } = useAuthContext()

    useEffect(() => {
        if (socket) {
            socket.on('newMessage', (newMessage) => {
                if (!selectedUser || !authUser) return

                const selectedId = String(selectedUser._id)
                const senderId = String(newMessage.senderId)
                const receiverId = String(newMessage.receiverId)

                // Only add message if it's relevant to the current conversation
                if ((senderId === selectedId && receiverId === authUser._id) ||
                    (senderId === authUser._id && receiverId === selectedId)) {

                    setMessages(prev => {
                        // Check if message already exists to prevent duplicates
                        const messageExists = prev.some(msg => String(msg._id) === String(newMessage._id))
                        if (!messageExists) {
                            console.log('New message received instantly:', newMessage._id)
                            // Add message immediately for instant display
                            return [...prev, newMessage]
                        }
                        return prev
                    })

                    // Instant auto-scroll using requestAnimationFrame
                    requestAnimationFrame(() => {
                        const scrollContainer = document.querySelector('[data-scroll-container]')
                        if (scrollContainer) {
                            scrollContainer.scrollTop = scrollContainer.scrollHeight
                        }
                    })
                }
            })

            socket.on('messageSent', (newMessage) => {
                // Handle messages sent by current user (for real-time update)
                if (!selectedUser || !authUser) return

                const selectedId = String(selectedUser._id)
                const receiverId = String(newMessage.receiverId)

                if (receiverId === selectedId) {
                    setMessages(prev => {
                        const messageExists = prev.some(msg => String(msg._id) === String(newMessage._id))
                        if (!messageExists) {
                            console.log('Own message added instantly:', newMessage._id)
                            return [...prev, newMessage]
                        }
                        return prev
                    })

                    // Instant auto-scroll using requestAnimationFrame
                    requestAnimationFrame(() => {
                        const scrollContainer = document.querySelector('[data-scroll-container]')
                        if (scrollContainer) {
                            scrollContainer.scrollTop = scrollContainer.scrollHeight
                        }
                    })
                }
            })

            socket.on('messageDeleted', (messageId) => {
                // Handle message deletion in real-time
                setMessages(prev => prev.filter(msg => String(msg._id) !== String(messageId)))
                console.log('Message deleted instantly:', messageId)
            })

            return () => {
                socket.off('newMessage')
                socket.off('messageSent')
                socket.off('messageDeleted')
            }
        }
    }, [socket, selectedUser, authUser])

    const fetchMessages = async (userId) => {
        if (!userId) return

        try {
            setLoading(true)
            const res = await messagesAPI.getMessages(userId)
            if (res.data.success) {
                setMessages(res.data.messages || [])
                console.log(`Loaded ${res.data.messages?.length || 0} messages for user ${userId}`)
            } else {
                console.error('Failed to fetch messages:', res.data.message)
                setMessages([])
            }
        } catch (error) {
            console.error('Failed to fetch messages:', error)
            setMessages([])
        } finally {
            setLoading(false)
        }
    }

    const sendMessage = async (messageData) => {
        if (!selectedUser || !authUser) return

        // Optimistic update - show message instantly while saving to database
        const tempMessage = {
            _id: 'temp_' + Date.now(),
            senderId: authUser._id,
            receiverId: selectedUser._id,
            text: messageData.text || '',
            image: messageData.image || '',
            seen: false,
            createdAt: new Date().toISOString(),
            __temp: true // Mark as temporary
        }

        // Show message immediately for instant feedback
        setMessages(prev => [...prev, tempMessage])

        // Instant scroll to show the new message
        requestAnimationFrame(() => {
            const scrollContainer = document.querySelector('[data-scroll-container]')
            if (scrollContainer) {
                scrollContainer.scrollTop = scrollContainer.scrollHeight
            }
        })

        try {
            // Send to server (this saves to database AND emits via socket)
            const res = await messagesAPI.sendMessage(selectedUser._id, messageData)

            if (res.data.success) {
                // Replace temporary message with real database message
                setMessages(prev => prev.map(msg =>
                    msg.__temp ? res.data.newMessage : msg
                ))
                console.log('Message saved to database and delivered via socket:', res.data.newMessage._id)
                return { success: true }
            } else {
                // Remove temporary message if send failed
                setMessages(prev => prev.filter(msg => !msg.__temp))
                return { success: false, message: res.data.message }
            }
        } catch (error) {
            console.error('Failed to send message:', error)
            // Remove temporary message on error
            setMessages(prev => prev.filter(msg => !msg.__temp))
            return {
                success: false,
                message: error.response?.data?.message || 'Failed to send message'
            }
        }
    }

    const selectUser = (user) => {
        if (!user) {
            setSelectedUser(null)
            setMessages([])
            return
        }

        // Clear search results when selecting a user
        setSearchResults([])
        setIsSearching(false)

        // Only set user if it's different from current selection
        if (!selectedUser || selectedUser._id !== user._id) {
            setSelectedUser(user)
            fetchMessages(user._id)
        }
    }

    const deleteMessage = async (messageId) => {
        try {
            const res = await messagesAPI.deleteMessage(messageId)
            if (res.data.success) {
                return { success: true }
            }
            return { success: false, message: res.data.message }
        } catch (error) {
            console.error('Failed to delete message:', error)
            return {
                success: false,
                message: error.response?.data?.message || 'Failed to delete message'
            }
        }
    }

    const searchMessages = async (query) => {
        if (!selectedUser || !query.trim()) {
            setSearchResults([])
            setIsSearching(false)
            return
        }

        try {
            setIsSearching(true)
            const res = await messagesAPI.searchMessages(selectedUser._id, query)
            if (res.data.success) {
                setSearchResults(res.data.messages)
            }
        } catch (error) {
            console.error('Failed to search messages:', error)
            setSearchResults([])
        } finally {
            setIsSearching(false)
        }
    }

    const clearSearch = () => {
        setSearchResults([])
        setIsSearching(false)
    }

    return (
        <ChatContext.Provider value={{
            messages,
            loading,
            selectedUser,
            sendMessage,
            deleteMessage,
            selectUser,
            fetchMessages,
            searchResults,
            isSearching,
            searchMessages,
            clearSearch
        }}>
            {children}
        </ChatContext.Provider>
    )
}
