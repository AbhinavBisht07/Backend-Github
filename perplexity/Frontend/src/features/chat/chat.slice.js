import { createSlice } from "@reduxjs/toolkit";

const chatSlice = createSlice({
    name: "chat",
    initialState:{
        chats: {},
        currentChatId: null,
        loading: false,
        error: null
    },
    reducers: {
        createNewChat: (state,action) => {
            const { chatId, title } = action.payload
            state.chats[ chatId ] = {
                id: chatId,
                title,
                messages: [],
                lastUpdated: new Date().toISOString()
            }
        },
        // for adding new Messages
        addNewMessage: (state, action) =>{
            const { chatId, content, role } = action.payload
            state.chats[chatId].messages.push({content, role})
        },
        // For rendering all messages when we open an existing chat 
        addMessages: (state, action) => {
            const { chatId, messages } = action.payload;
            state.chats[ chatId ].messages.push(...messages) 
        },
        // addMessages: (state, action) => {
        //     const { chatId, messages } = action.payload;
        //     // state.chats[ chatId ].messages.push(...messages) //bug
        //     state.chats[ chatId ].messages = messages;
        //     // .push() was creating a bug because it was never clearing the old array, it just kept shoving new items into it. So every time I opened an existing chat, it pushes the same messages fetched from the API on top of whatever was already there.
        // },
        setChats: (state, action)=>{
            state.chats = action.payload
        },
        setCurrentChatId: (state, action)=>{
            state.currentChatId = action.payload
        },
        setLoading: (state, action)=>{
            state.loading = action.payload 
        },
        setError: (state, action)=>{
            state.error = action.payload
        }
    }
})

export const {setChats, setCurrentChatId, setLoading, setError, createNewChat, addNewMessage, addMessages} = chatSlice.actions;

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