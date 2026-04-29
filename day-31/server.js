import app from "./src/app.js";
import { createServer } from "http";
import { Server } from "socket.io";


const httpServer = createServer(app);
const io = new Server(httpServer, { /* options */ });


io.on("connection", (socket) => {
  console.log("New connection created");

  socket.on("message", (msg)=>{
    console.log("User fired message event")
    console.log(msg);
    io.emit("abc", msg)
  })
})


httpServer.listen(3000, ()=>{
    console.log("Server is running on port 3000");
});
// app.listen(3000, ()=>{
//     console.log("Server is running on port 3000");
// })