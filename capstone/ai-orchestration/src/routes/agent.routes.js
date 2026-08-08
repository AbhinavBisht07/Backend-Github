import { Router } from "express";
import agent from "../agents/code.agent.js"

const agentRouter = Router();

agentRouter.post("/invoke", async (req,res)=> {
    try{
        const {message} = req.body;
        const response = await agent.invoke({ messages: [{
            role: "user",
            content: message
        }] });
        res.json({response});
    } 
    // catch(error){
    //     console.error("Error invoking agent:", error);
    //     res.status(500).json({ error: "Failed to invoke agent" })
    // }
    catch (error) {
    console.error("========== INVOKE ERROR ==========");
    console.error(error);
    console.error(error?.stack);

    if (error?.cause) {
        console.error("Cause:");
        console.error(error.cause);
    }

    if (error?.response) {
        console.error("Response:");
        console.error(error.response.data);
    }

    res.status(500).json({
        error: error.message
    })}
});

export default agentRouter