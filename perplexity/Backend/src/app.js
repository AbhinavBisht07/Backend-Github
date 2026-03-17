import express from "express";
import cookieParser from "cookie-parser";
import morgan from "morgan";
import cors from "cors";

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


export default app