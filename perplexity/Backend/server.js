import "dotenv/config"; //automatically calls config() internally. Node loads the dotenv/config module, and inside that module dotenv.config() is executed automatically.
import app from "./src/app.js";
import http from "http"; //new
import connectToDatabase from "./src/config/database.js";
import { initSocket } from "./src/sockets/server.socket.js";



const PORT = process.env.PORT || 3000


const httpServer = http.createServer(app);  //new

initSocket(httpServer); //new


connectToDatabase();


httpServer.listen(PORT, ()=>{
    console.log(`Server is running on port ${PORT}`);
})

