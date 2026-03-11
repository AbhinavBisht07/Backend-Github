import "dotenv/config"; //automatically calls config() internally. Node loads the dotenv/config module, and inside that module dotenv.config() is executed automatically.
import app from "./src/app.js";
import connectToDatabase from "./src/config/database.js";

const PORT = process.env.PORT || 3000


connectToDatabase();


app.listen(PORT, ()=>{
    console.log(`Server is running on port ${PORT}`);
})