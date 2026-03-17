import { Router } from "express";
import { sendMessage, getChats, getMessages, deleteChat } from "../controllers/chat.controller.js";
import { authUser } from "../middlewares/auth.middleware.js";

const chatRouter = Router();


/**
 * @route POST /api/chats/message
 * @description
 * @access Private
 */
chatRouter.post("/message", authUser, sendMessage)

/**
 * @route GET /api/chats/
 * @description fetch all chats of a user
 * @access Private
 */
chatRouter.get("/", authUser, getChats);

/**
 * @route GET /api/chats/:chatId/messages
 * @description fetch all messagges of a particular chat of a user
 * @access Private
 */
chatRouter.get("/:chatId/messages", authUser, getMessages);

/**
 * @route DELETE /api/chats/delete/:chatId/
 * @description Delete a particular chat and all its messages 
 * @access Private
 */
chatRouter.delete("/delete/:chatId", authUser, deleteChat);


export default chatRouter;