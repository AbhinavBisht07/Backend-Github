import { generateResponse } from "../services/ai.service.js";
import { generateChatTitle } from "../services/ai.service.js";
import chatModel from "../models/chat.model.js";
import messageModel from "../models/message.model.js";


export async function sendMessage(req,res){
    const { message, chat: chatId } = req.body;

    // console.log(message);
    // const result = await generateResponse(message);
    
    // agar chatId nahi hai tab hi generate karenge title and chat
    let title = null;
    let chat = null;
    if(!chatId){
        title = await generateChatTitle(message);
        // creating chat in database
        chat = await chatModel.create({
            user: req.user.id,
            title
        })
    }

    // storing userMessage in database :-
    const userMessage = await messageModel.create({
        chat: chatId || chat._id, //ya to body wali chatId .. ya to nayi chat agar generate hui to uski chat id ...
        content: message,
        role: "user"
    })

    
    // fetching all messages in a particular chat :-
    const messages = await messageModel.find({ chat: chatId || chat._id });
    
    const result = await generateResponse(messages);

    
    // storing aiMessage in database :-
    const aiMessage = await messageModel.create({
        chat: chatId || chat._id,
        content: result,
        role: "ai"
    })

    res.status(201).json({
        // title,
        chat: chat || {_id: chatId},
        // userMessage,
        aiMessage
    })
}

// ek user ki saari chats fetch karke return karega
export async function getChats(req,res){
    const user = req.user;

    const chats = await chatModel.find({user: user.id});

    res.status(200).json({
        message: "Chats recieved successfully",
        chats
    })
}

// ek particuar chat ke saare messages fetch karke return karega.
export async function getMessages(req,res){
    const { chatId } = req.params;

    // ek check lagaenge ki jo chats aarhi hain and jo user request kar raha hai .. kya ussi user ki chats hain ye  ...
    const chat = await chatModel.findOne({
        _id: chatId,
        user: req.user.id
    })

    if(!chat){
        return res.status(404).json({
            message: "Chat not found"
        })
    }

    const messages = await messageModel.find({
        chat: chatId
    })

    res.status(200).json({
        message: "Messagges retrieved successfully",
        messages
    })
}


export async function deleteChat(req,res){
    const { chatId } = req.params;

    const chat = await chatModel.findOneAndDelete({
        _id: chatId,
        user: req.user.id
    })
    // chat delete hojaegi to uske andar ke messages bhi store karne ka sense banta nahi hai .. to delete kar denge unko bhi ..
    await messageModel.deleteMany({
        chat: chatId
    })

    if(!chat){
        return res.status(404).json({
            message: "Chat not found",
        })
    }

    res.status(200).json({
        message: "Chat deleted successfully"
    })
} 