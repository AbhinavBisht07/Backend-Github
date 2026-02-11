// Create server
// Config server

const express = require("express");
const app = express(); //server created
const authRouter = require("./routes/auth.routes");
const cookieParser = require("cookie-parser");


app.use(express.json()); ///middleware used to read JSON data and parse it(convert JSON data to javascript Object) ... so that our backend can use it
app.use(cookieParser());
app.use("/api/auth", authRouter); // sets routes .... It connects all routes inside authRouter to start with /api/auth



module.exports = app;





// 1️⃣ express.json()
// ✅ Middleware
// 👉 Parses incoming JSON and puts it in req.body

// 2️⃣ authRouter
// ✅ Router (also works like middleware)
// 👉 Groups related routes (login, register, etc.)

// 3️⃣ cookie-parser()
// ✅ Middleware
// 👉 Reads cookies from the request and parses them