import express from "express";
import morgan from "morgan";
import fs from "fs";

// workspace hi humari working directory rahegi .. kyuki workspace hi ek esa folder rahega jo humare VITE ke dev container and humare agent ke container, dono ke beech mein common hone waala hai ..
const WORKING_DIR = '/workspace';


const app = express();

app.use(morgan('dev'));

app.get('/', (req,res)=>{
    res.status(200).json({
        message: "Hello from sandbox agent",
        status: "Success!"
    })
});


app.get("/list-files", async (req,res)=>{
    const elements = await fs.promises.readdir(WORKING_DIR);

    res.status(200).json({
        message: 'Elements in working directory',
        elements
    })
})


export default app;