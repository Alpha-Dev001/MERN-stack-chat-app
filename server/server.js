import express from "express";
import "dotenv/config";
import cors from "cors";
import http from "http";
import { connectDB } from "./lib/db.js";
import userRouter from "./routes/useRoutes.js";
import messageRouter from "./routes/messageRoutes.js";
import { initSocket } from "./lib/socket.js"

//Create Express app and HTTP server
const app = express();
const server = http.createServer(app)

//Initialize socket.io server
initSocket(server)

//middleware setup
app.use(express.json({ limit: "4mb" }));
app.use(cors());

//ROutes setup
app.use("/api/status", (req, res) => { res.send("Server is running"); });
app.use("/api/auth", userRouter);
app.use("/api/messages", messageRouter);

await connectDB();

const PORT = process.env.PORT || 5000;

server.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});



