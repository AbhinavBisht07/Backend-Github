// server create
// server config

globalThis.File = require("node:buffer").File; //
const express = require("express");
const cookieParser = require("cookie-parser");
const authRouter = require("./routes/auth.routes");
const postRouter = require("./routes/post.routes");


const app = express(); //server created
app.use(express.json()); //middleware used to read and parse JSON data(convert JSON data to javascript object)
app.use(cookieParser()); //middleware

app.use("/api/auth", authRouter); //routes
app.use("/api/posts", postRouter)


module.exports = app;