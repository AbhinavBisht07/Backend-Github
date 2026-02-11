// start server
// connect server with database

require('dotenv').config() // first line ye likhte hain server.js mein
const app = require("./src/app")
const connectToDb = require("./src/config/database")


connectToDb();


app.listen(3000, ()=>{
    console.log("Server is running on port 3000");
})