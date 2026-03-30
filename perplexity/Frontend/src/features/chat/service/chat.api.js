import axios from "axios"


const api = axios.create({
    baseURL: "http://localhost:3000",
    withCredentials: true
})

// Since I am using axios for all my API calls, I need to bypass axios for sendMessage function specifically,  because axios doesn't support SSE/streaming. I have to use plain fetch just for that one call.
export const sendMessage = async ({message, chatId})=>{
    // const response  = await api.post("/api/chats/message", {message, chat: chatId});
    // return response.data;
    const response  = await fetch("http://localhost:3000/api/chats/message", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include", //equivalent to axios's withCredentials: true
        body: JSON.stringify({message, chat: chatId})
    })
    // return response.data;
    return response; // returning raw response so that useChat.js can stream it 
}
export const getChats = async ()=>{
    const response  = await api.get("/api/chats");
    return response.data;
}
export const getMessages = async (chatId)=>{
    const response  = await api.get(`/api/chats/${chatId}/messages`);
    return response.data;
}
export const deleteChat = async (chatId)=>{
    const response  = await api.delete(`/api/chats/delete/${chatId}`);
    return response.data;
}