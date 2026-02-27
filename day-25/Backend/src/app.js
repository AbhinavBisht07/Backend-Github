const express = require("express");
const cookieParser = require("cookie-parser");


const app = express();
app.use(express.json()); //middleware
app.use(cookieParser());

// requiring routers :-
const authRouter = require("./routes/auth.routes");

// using routers :-
app.use("/api/auth", authRouter)


module.exports = app;