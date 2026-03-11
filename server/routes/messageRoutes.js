import express from "express"
import { protectRoute } from "../middleware/auth.js";
import { getMessages, getUsersForSiderBar, markMessageAsSeen, sendMessage, deleteMessage, searchMessages } from "../controllers/messageController.js";

const messageRouter = express.Router();

messageRouter.get("/users", protectRoute, getUsersForSiderBar);
messageRouter.get("/:id", protectRoute, getMessages);
messageRouter.get("/search/:userId", protectRoute, searchMessages);
messageRouter.put("/mark/:id", protectRoute, markMessageAsSeen);
messageRouter.post("/send/:id", protectRoute, sendMessage);
messageRouter.delete("/:messageId", protectRoute, deleteMessage);

export default messageRouter;