globalThis.File = require("node:buffer").File

const express = require("express");
const cookieParser = require("cookie-parser");
const cors = require("cors");


const app = express();
app.use(express.json()); //middleware
app.use(cookieParser());
app.use(cors({
    origin: "http://localhost:5173",
    credentials: true
}))

// requiring routers :-
const authRoutes = require("./routes/auth.routes");
const songRoutes = require("./routes/song.rutes");

// using routers :-
app.use("/api/auth", authRoutes);
app.use("/api/songs", songRoutes)


module.exports = app;