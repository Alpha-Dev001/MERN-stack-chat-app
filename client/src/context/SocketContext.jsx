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
    const { authUser } = useAuthContext()

    useEffect(() => {
        if (authUser) {
            const socket = io(import.meta.env.VITE_API_URL || 'http://localhost:5000', {
                auth: {
                    userId: authUser._id
                }
            })

            setSocket(socket)

            socket.on('getOnlineUsers', (users) => {
                setOnlineUsers(users)
            })

            socket.on('newMessage', (message) => {
                // This will be handled by the component that needs it
                // We could add a callback or use a state management solution
                console.log('New message received:', message)
            })

            return () => {
                socket.off('getOnlineUsers')
                socket.off('newMessage')
                socket.close()
            }
        } else {
            if (socket) {
                socket.off('getOnlineUsers')
                socket.off('newMessage')
                socket.close()
                setSocket(null)
            }
        }
    }, [authUser])

    return (
        <SocketContext.Provider value={{ socket, onlineUsers }}>
            {children}
        </SocketContext.Provider>
    )
}
