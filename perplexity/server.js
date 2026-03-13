import "dotenv/config"; //automatically calls config() internally. Node loads the dotenv/config module, and inside that module dotenv.config() is executed automatically.
import app from "./src/app.js";
import connectToDatabase from "./src/config/database.js";

// import { testAi } from "./src/services/ai.service.js";

const PORT = process.env.PORT || 3000

// testAi();

connectToDatabase();


app.listen(PORT, ()=>{
    console.log(`Server is running on port ${PORT}`);
})

