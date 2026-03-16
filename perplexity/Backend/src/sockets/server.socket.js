import { Server } from "socket.io";


let io;

export function initSocket(httpServer){
    io = new Server(httpServer, {
        cors: {
            origin: "http://localhost:5173",
            credentials: true
        }
    })

    console.log("Socket io server is running")

    io.on("connection", (socket) => {
        console.log("A user connected: " + socket.id);
        // socket id kya hai ? multiple users connect karte hain humare server se to ye socket.id mein basically unki unique id stored hoti hai 
        // agar user kisi wajah se disconnect hogya server se ... to ab agar wo fir connect karega to usko ek nayi socket.id assign hogi... jitni baar user isconnect karke connect karega utni baar new id assign hogi

    })
}


export function getIo(){
    if(!io){
        throw new Error("Socket.io not initialized")
    }

    return io;
}