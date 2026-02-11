// create server
// config server

const express = require("express");
const authRouter = require("./routes/auth.routes")
const cookieParser = require("cookie-parser")

const app = express();

app.use(express.json()); //middleware1

app.use(cookieParser()) //middleware2 : as a middleware use kr liya cookie-parser ko
// IMPORTANT :- Cookie-parser must come AFTER basic middlewares and BEFORE routes.

app.use("/api/auth", authRouter); //routes


module.exports = app 