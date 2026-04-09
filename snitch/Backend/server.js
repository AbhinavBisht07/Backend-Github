import app from "./src/app.js";
import connectToDatabase from "./src/config/database.js";

const PORT = process.env.PORT || 3000;

const startServer = async () => {
    try {
        await connectToDatabase();

        app.listen(PORT, ()=>{
            console.log("Server is running on port 3000");
        });
    } catch(error) {
        console.error("Failed to start server:", error.message);
        process.exit(1);
    }
}

startServer();