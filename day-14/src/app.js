// server create
// server config
const express = require("express");
const authRouter = require("./routes/auth.routes")
const cookieParser = require("cookie-parser");


const app = express(); //server created
app.use(express.json()); //middleware used to read and parse JSON data(convert JSON data to javascript object)
app.use(cookieParser()); //middleware
app.use("/api/auth", authRouter); //routes


module.exports = app;