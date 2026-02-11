// Start server
// connect to Database


require("dotenv").config(); // Sabse first line ye likhte hain server.js mein
const app = require("./src/app");
const connectToDb = require("./src/config/database")


connectToDb();


// server started :-
app.listen(3000, ()=>{  
    console.log("Server is running on port 3000")
})