// start server
// connect server to database

const app = require("./src/app");
const connectToDb = require("./src/config/database");
const mongoose = require("mongoose");

connectToDb();

app.listen(3000, ()=>{
    console.log("Server is running on port 3000");
    
})