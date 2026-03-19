import { initializeSocketConnection } from "../service/chat.socket";
import { sendMessage, getChats, getMessages, deleteChat } from "../service/chat.api";
import { setChats, setCurrentChatId, setLoading, setError, createNewChat, addNewMessage, addMessages } from "../chat.slice";
import { useDispatch, useSelector } from "react-redux";

export const useChat = ()=>{

    const dispatch = useDispatch();

    const currentChatId = useSelector( state => state.chat.currentChatId); //new


    // async function handleSendMessage({message, chatId}){
    async function handleSendMessage({message}){ //new
        dispatch(setLoading(true));


        console.log('currentChatId at time of sending:', currentChatId) // ← add this


        // const data = await sendMessage({message, chatId});
        const data = await sendMessage({message, chat: currentChatId}); // new
        const { chat, aiMessage } = data;


         console.log('response from server:', chat._id, chat.title) // ← add this


        // Only create a new chat when no chatId is present
        if(!currentChatId){
            dispatch(createNewChat({
                chatId: chat._id,
                title: chat.title
            }))
        }

        dispatch(addNewMessage({
            chatId: chat._id,
            content: message,
            role: "user",

        }))
        dispatch(addNewMessage({
            chatId: chat._id,
            content: aiMessage.content,
            role: aiMessage.role
        }))
        dispatch(setCurrentChatId(chat._id))

        dispatch(setLoading(false));
    }


    async function handleGetChats(){
        dispatch(setLoading(true))
        const data = await getChats()
        const {chats} = data;
        dispatch(setChats(chats.reduce((acc,chat) =>{
            acc[chat._id] = {
                id: chat._id,
                title: chat.title,
                messages: [],
                lastUpdated: chat.updated
            }
            return acc
        }, {})))
        dispatch(setLoading(false));
    }


    async function handleOpenChat(chatId){
        const data = await getMessages(chatId);
        const { messages } = data;

        const formattedMessages = messages.map(msg => {
            return ({
                content: msg.content,
                role: msg.role
            })
        })
        dispatch(addMessages({
            chatId,
            messages: formattedMessages,
        }))
        dispatch(setCurrentChatId(chatId));
    }


    return {
        initializeSocketConnection,
        handleSendMessage,
        handleGetChats,
        handleOpenChat
    }
}