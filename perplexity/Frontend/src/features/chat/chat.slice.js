import { createSlice } from "@reduxjs/toolkit";

const chatSlice = createSlice({
    name: "chat",
    initialState: {
        chats: {},
        currentChatId: null,
        loading: false,
        error: null
    },
    reducers: {
        createNewChat: (state, action) => {
            const { chatId, title } = action.payload
            if (state.chats[chatId]) return  // skip if already exists
            state.chats[chatId] = {
                id: chatId,
                title,
                messages: [],
                lastUpdated: new Date().toISOString()
            }
        },
        // for adding new Messages
        addNewMessage: (state, action) => {
            const { chatId, content, role } = action.payload
            // state.chats[chatId].messages.push({content, role})
            const messages = state.chats[chatId].messages;

            // If last message is already an AI message, just update its content
            const lastMessage = messages[messages.length - 1];
            if (lastMessage && lastMessage.role === "ai" && lastMessage.isStreaming) {
                lastMessage.content = content; // update instead of adding new
            } else {
                //otherwise push a new message(for user messages or first AI token)
                messages.push({ content, role, isStreaming: role === "ai" })
            }
        },
        // and when streaming is done, mark it as no longer streaming
        finalizeMessage: (state, action) => {
            const { chatId } = action.payload;
            const messages = state.chats[chatId].messages;
            const lastMessage = messages[messages.length - 1];
            if (lastMessage && lastMessage.isStreaming) {
                lastMessage.isStreaming = false // streaming done
            }
        },
        // For rendering all messages when we open an existing chat 
        addMessages: (state, action) => {
            const { chatId, messages } = action.payload;
            state.chats[chatId].messages.push(...messages)
        },
        // addMessages: (state, action) => {
        //     const { chatId, messages } = action.payload;
        //     // state.chats[ chatId ].messages.push(...messages) //bug
        //     state.chats[ chatId ].messages = messages;
        //     // .push() was creating a bug because it was never clearing the old array, it just kept shoving new items into it. So every time I opened an existing chat, it pushes the same messages fetched from the API on top of whatever was already there.
        // },
        setChats: (state, action) => {
            state.chats = action.payload
        },
        setCurrentChatId: (state, action) => {
            state.currentChatId = action.payload
        },
        setLoading: (state, action) => {
            state.loading = action.payload
        },
        setError: (state, action) => {
            state.error = action.payload
        },
        // for logout:-
        resetChat: (state) => {
            state.chats = {};
            state.currentChatId = null;
            state.loading = false;
            state.error = null;
        }
    }
})

export const { setChats, setCurrentChatId, setLoading, setError, createNewChat, addNewMessage, finalizeMessage, addMessages, resetChat } = chatSlice.actions;

export default chatSlice.reducer;


// example structure :-
// chats = {
//     "Good night's sleep": {
//         messages: [
//             {
//                 role: "user",
//                 content: "Explain why slee is important."
//             },
//             {
//                 role: "ai",
//                 content: "Sleep is essential for overall health and well-being. It allows the body to repair itself, supports brain function, and helps regulate emotions."
//             }
//         ],
//         id: "chatId",
//         updatedAt: "2024-06-xyzxyzxyz",
//         createdAt: "2024-06-xyzxyzxyz"
//     },
//     "docker and AWS": {
//         messages: [
//             {
//                 role: "user",
//                 content: "What is docker?"
//             },
//             {
//                 role: "ai",
//                 content: "Docker is a platform that allows developers to automate the deployment of applications inside lightweight, portable containers."
//             }
//         ],
//         id: "chatId",
//         updatedAt: "2024-06-xyzxyzxyz",
//         createdAt: "2024-06-xyzxyzxyz"
//     }
// }