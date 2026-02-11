// server start
// connect to DB


require("dotenv").config(); // sabse pehli line hoti hai ye server.js ki 
const app = require("./src/app");
const connectToDatabase = require("./src/config/database")


connectToDatabase()


app.listen(3000, ()=>{
    console.log("Server is running on port 3000");
})