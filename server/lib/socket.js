import { Server } from "socket.io"

export const userSocketMap = {} // {userId: socketId}

export let io = null

export const initSocket = (server) => {
    io = new Server(server, {
        cors: { origin: "*" },
    })

    io.on("connection", (socket) => {
        const userId = socket.handshake.auth?.userId
        console.log("user connected", userId)

        if (userId) userSocketMap[userId] = socket.id
        io.emit("getOnlineUsers", Object.keys(userSocketMap))

        socket.on("disconnect", () => {
            console.log("User disconnected", userId)
            delete userSocketMap[userId]
            io.emit("getOnlineUsers", Object.keys(userSocketMap))
        })
    })

    return io
}
