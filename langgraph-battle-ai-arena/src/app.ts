import express from "express";
import useGraph from "./services/graph.ai.service.js"

const app = express();

// health check API :-
app.get('/health', (req,res)=>{
    res.status(200).json({ status: 'ok' })
}) 


app.post("/use-graph", async (req,res)=>{
    await useGraph("Write a factorial function in JavaScript")
})


export default app;