import express from "express";
import runGraph from "./ai/graph.ai.js";   

const app = express();


app.get("/heath", (req,res)=>{
    res.send("Hello, world");
})

app.get("/", async(req,res)=>{
    const result = await runGraph("Write a code for factorial function in js.")

    res.json(result)
})


export default app