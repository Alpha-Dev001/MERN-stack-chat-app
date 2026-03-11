import React, { createContext, useContext, useEffect, useState } from 'react'
import { io } from 'socket.io-client'
import { useAuthContext } from './AuthContext'

const SocketContext = createContext()

export const useSocketContext = () => {
    return useContext(SocketContext)
}

export const SocketContextProvider = ({ children }) => {
    const [socket, setSocket] = useState(null)
    const [onlineUsers, setOnlineUsers] = useState([])
    const [typingUsers, setTypingUsers] = useState(new Set())
    const [userStatuses, setUserStatuses] = useState({})
    const { authUser } = useAuthContext()

    useEffect(() => {
        if (authUser) {
            // Extract base URL without /api for socket connection
            const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:5000'
            const socketUrl = apiUrl.replace('/api', '')

            const socket = io(socketUrl, {
                auth: {
                    userId: authUser._id
                }
            })

            console.log('Socket connecting to:', socketUrl)
            setSocket(socket)

            socket.on('getOnlineUsers', (users) => {
                console.log('Online users updated:', users)
                setOnlineUsers(users)
            })

            socket.on('userStatusChanged', ({ userId, status }) => {
                console.log('User status changed:', { userId, status })
                setUserStatuses(prev => ({
                    ...prev,
                    [userId]: status
                }))

                // Update online users list based on status
                if (status === 'online') {
                    setOnlineUsers(prev => {
                        if (!prev.includes(userId)) {
                            return [...prev, userId]
                        }
                        return prev
                    })
                } else {
                    setOnlineUsers(prev => prev.filter(id => id !== userId))
                }
            })

            socket.on('newMessage', (message) => {
                // This will be handled by the component that needs it
                // We could add a callback or use a state management solution
                console.log('New message received:', message)
            })

            socket.on('userTyping', ({ senderId }) => {
                setTypingUsers(prev => new Set(prev).add(senderId))
            })

            socket.on('userStoppedTyping', ({ senderId }) => {
                setTypingUsers(prev => {
                    const newSet = new Set(prev)
                    newSet.delete(senderId)
                    return newSet
                })
            })

            return () => {
                socket.off('getOnlineUsers')
                socket.off('userStatusChanged')
                socket.off('newMessage')
                socket.off('userTyping')
                socket.off('userStoppedTyping')
                socket.close()
            }
        } else {
            if (socket) {
                socket.off('getOnlineUsers')
                socket.off('userStatusChanged')
                socket.off('newMessage')
                socket.off('userTyping')
                socket.off('userStoppedTyping')
                socket.close()
                setSocket(null)
            }
        }
    }, [authUser])

    const emitTyping = (receiverId) => {
        if (socket) {
            socket.emit('typing', { receiverId })
        }
    }

    const emitStopTyping = (receiverId) => {
        if (socket) {
            socket.emit('stopTyping', { receiverId })
        }
    }

    const isUserOnline = (userId) => {
        return onlineUsers.includes(userId) || userStatuses[userId] === 'online'
    }

    return (
        <SocketContext.Provider value={{
            socket,
            onlineUsers,
            typingUsers,
            userStatuses,
            emitTyping,
            emitStopTyping,
            isUserOnline
        }}>
            {children}
        </SocketContext.Provider>
    )
}
