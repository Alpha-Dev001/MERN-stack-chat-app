import { Server } from "socket.io"

export const userSocketMap = {} // {userId: socketId}
export const typingUsers = {} // {conversationId: [userIds]}
export const connectedUsers = new Set() // Track all connected users

export let io = null

export const initSocket = (server) => {
    io = new Server(server, {
        cors: { origin: "*" },
    })

    io.on("connection", (socket) => {
        const userId = socket.handshake.auth?.userId
        console.log("User connected:", userId)

        if (userId) {
            // Add user to socket map
            userSocketMap[userId] = socket.id
            connectedUsers.add(userId)

            // Broadcast updated online users list
            io.emit("getOnlineUsers", Array.from(connectedUsers))

            // Broadcast user status change to all clients
            io.emit("userStatusChanged", { userId, status: "online" })

            console.log("Online users:", Array.from(connectedUsers))
        }

        socket.on("typing", ({ receiverId }) => {
            if (!userId) return;

            const conversationId = [userId, receiverId].sort().join('_')
            if (!typingUsers[conversationId]) {
                typingUsers[conversationId] = new Set()
            }
            typingUsers[conversationId].add(userId)

            // Notify receiver that sender is typing
            const receiverSocketId = userSocketMap[receiverId]
            if (receiverSocketId) {
                io.to(receiverSocketId).emit("userTyping", { senderId: userId })
            }
        })

        socket.on("stopTyping", ({ receiverId }) => {
            if (!userId) return;

            const conversationId = [userId, receiverId].sort().join('_')
            if (typingUsers[conversationId]) {
                typingUsers[conversationId].delete(userId)
                if (typingUsers[conversationId].size === 0) {
                    delete typingUsers[conversationId]
                }
            }

            // Notify receiver that sender stopped typing
            const receiverSocketId = userSocketMap[receiverId]
            if (receiverSocketId) {
                io.to(receiverSocketId).emit("userStoppedTyping", { senderId: userId })
            }
        })

        socket.on("disconnect", () => {
            if (userId) {
                console.log("User disconnected:", userId)

                // Remove from tracking
                delete userSocketMap[userId]
                connectedUsers.delete(userId)

                // Clean up typing indicators
                Object.keys(typingUsers).forEach(conversationId => {
                    if (typingUsers[conversationId].has(userId)) {
                        typingUsers[conversationId].delete(userId)
                        if (typingUsers[conversationId].size === 0) {
                            delete typingUsers[conversationId]
                        }
                    }
                })

                // Broadcast updated online users list
                io.emit("getOnlineUsers", Array.from(connectedUsers))

                // Broadcast user status change to all clients
                io.emit("userStatusChanged", { userId, status: "offline" })

                console.log("Online users after disconnect:", Array.from(connectedUsers))
            }
        })
    })

    return io
}
