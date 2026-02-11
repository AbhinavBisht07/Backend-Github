// create server
// config server

const express = require("express");
const authRouter = require("./routes/auth.routes")
const cookieParser = require("cookie-parser")

const app = express();

app.use(express.json()); //middleware

app.use("/api/auth", authRouter); 

app.use(cookieParser()) // as a middleware use kr liya cookie-parser ko

module.exports = app 