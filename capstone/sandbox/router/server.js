import httpServer from "./src/app.js";

httpServer.listen(3000, ()=>{
    console.log("Router is running on port 3000");
})