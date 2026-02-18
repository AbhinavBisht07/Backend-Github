// server create
// server config

globalThis.File = require("node:buffer").File; //
const express = require("express");
const cookieParser = require("cookie-parser");

const app = express(); //server created
app.use(express.json()); //middleware used to read and parse JSON data(convert JSON data to javascript object)
app.use(cookieParser()); //middleware


// Requiring routes :-
const authRouter = require("./routes/auth.routes");
const postRouter = require("./routes/post.routes");
const userRouter = require("./routes/user.routes");

// Using routes :-
app.use("/api/auth", authRouter); 
app.use("/api/posts", postRouter);
app.use("/api/users", userRouter);


module.exports = app;