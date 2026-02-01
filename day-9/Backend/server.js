// Server ko start karna 
// Server ko Database se connect karna

require('dotenv').config() //ye sabse pehli line likhte hain server.js file mein
const app = require("./src/app")
const connectToDb = require("./src/config/database")


connectToDb();


app.listen(3000, ()=>{
    console.log("Server is running on port 3000");
})