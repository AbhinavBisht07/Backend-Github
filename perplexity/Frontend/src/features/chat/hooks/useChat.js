import { initializeSocketConnection } from "../service/chat.socket";
import { sendMessage, getChats, getMessages, deleteChat } from "../service/chat.api";
import { setChats, setCurrentChatId, setLoading, setError, createNewChat, addNewMessage, finalizeMessage, addMessages } from "../chat.slice";
import { useDispatch, useSelector } from "react-redux";


export const useChat = () => {

    const dispatch = useDispatch();

    // const currentChatId = useSelector( state => state.chat.currentChatId); //new


    async function handleSendMessage({ message, chatId }) {
        // async function handleSendMessage({message}){ //new
        dispatch(setLoading(true));

        // const data = await sendMessage({message, chatId});
        // // const data = await sendMessage({message, chat: currentChatId}); // new
        // const { chat, aiMessage } = data;

        // new way :- just pass response directly to reader
        const response = await sendMessage({ message, chatId });
        const reader = response.body.getReader();
        const decoder = new TextDecoder();
        let currentChatId = chatId
        let streamedContent = ""; // accumulates tokens for live UI

        while (true) {
            const { done, value } = await reader.read();
            if (done) break;

            const text = decoder.decode(value);
            const events = text.split("\n\n").filter(Boolean);

            for (const event of events) {
                const lines = event.split("\n");
                const eventType = lines[0].replace("event: ", "");
                const data = JSON.parse(lines[1].replace("data: ", ""))

                if (eventType === "metadata") {
                    currentChatId = data.chat._id;
                    if (!chatId) {
                        dispatch(createNewChat({
                            chatId: data.chat._id,
                            title: data.chat.title
                        }));
                    }
                    dispatch(setCurrentChatId(data.chat._id));

                    // adding user message to UI immediately(not waiting for the server to send AI's response)
                    dispatch(addNewMessage({
                        chatId: currentChatId,
                        content: message,
                        role: "user"
                    }))

                }

                if (eventType === "token") {
                    // Iterating character by character instead of dumping the whole token(bunch of 15-20 words) at once
                    for (const char of data.token){
                        streamedContent += char;
                        dispatch(addNewMessage({
                            chatId: currentChatId,
                            content: streamedContent,
                            role: "ai",
                        }));
                        // small fake delay to simulate a smooth AI message streaming effect (it doesnt make much difference tho ... the only difference maker is the above code in which we are streaming one character at a time from a token):-
                        await new Promise(resolve => setTimeout(resolve, 5)); //5 millisecond per token 
                    }

                }

                if (eventType === "done") {
                    dispatch(finalizeMessage({ chatId: currentChatId }))
                    dispatch(setLoading(false));
                }
            }

            // Only create a new chat when no chatId is present
            // if(!chatId){
            // // if(!currentChatId){ // new
            //     dispatch(createNewChat({
            //         chatId: chat._id,
            //         title: chat.title
            //     }))
            // }

            // dispatch(addNewMessage({
            //     chatId: chatId || chat._id,
            //     content: message,
            //     role: "user",

            // }))
            // dispatch(addNewMessage({
            //     chatId: chatId || chat._id,
            //     content: aiMessage.content,
            //     role: aiMessage.role
            // }))
            // dispatch(setCurrentChatId(chat._id))

            // dispatch(setLoading(false));
        }
    }


    async function handleGetChats() {
        dispatch(setLoading(true))
        const data = await getChats()
        const { chats } = data;
        dispatch(setChats(chats.reduce((acc, chat) => {
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


    async function handleOpenChat(chatId, chats) {
        if (chats[chatId].messages.length === 0) {
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
        }
        dispatch(setCurrentChatId(chatId));
    }


    return {
        initializeSocketConnection,
        handleSendMessage,
        handleGetChats,
        handleOpenChat
    }
}