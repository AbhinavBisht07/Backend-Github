import { io } from "socket.io-client";


export const initializeSocketConnection = ()=>{
    // const socket = io("http://localhost:3000", {
    const socket = io("https://perplexity-clone-9lkm.onrender.com", {
        withCredentials: true, 
    })

    socket.on("connect", () => {
        console.log("Connected to Socket.io server")
    })
}