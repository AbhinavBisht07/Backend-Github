import express from "express";
import cookieParser from "cookie-parser";
import morgan from "morgan";
import cors from "cors";

import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);


const app = express();


//middlewares :-
app.use(express.json());
app.use(express.urlencoded({extended: true}))
app.use(cookieParser());
app.use(morgan("dev"));
app.use(cors({
    origin: "http://localhost:5173",
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE"]
}))


const publicPath = path.join(__dirname, "..", "public");
app.use(express.static(publicPath))

// health check :- browser mein jaake likho localhost:3000 
app.get("/", (req,res) =>{
    res.json({message: "Server is running"});
})


// importing routes
import authRouter from "./routes/auth.routes.js";
import chatRouter from "./routes/chat.routes.js";

// using routes
app.use("/api/auth", authRouter)
app.use("/api/chats", chatRouter);


// Wildcard route
app.use((req,res) => {
    // res.send("This is a wildcard route")
    res.sendFile(path.join(publicPath, "index.html"))
})


export default app