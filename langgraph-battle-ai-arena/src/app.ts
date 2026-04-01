import express from "express";

const app = express();

// health check API :-
app.get('/health', (req,res)=>{
    res.status(200).json({ status: 'ok' })
}) 


export default app;