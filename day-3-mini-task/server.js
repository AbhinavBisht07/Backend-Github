const express =require("express");

const app = express();

//creating an array of objects :-
// const notes = [
//     {
//         title: "test title 1",
//         description: "test description 1"
//     },
//     {
//         title: "test title 2",
//         description: "test description 2"
//     },
//     // example ke liye banaye the ye .. starting mein empty hi rakhenge isko hum
// ];


app.use(express.json());


const notes = [];

app.post("/notes", (req,res)=>{

    console.log(req.body);
    //ab jab data access kar paa rahe hum to uss data ko array mein daal denge...
    notes.push(req.body); //request send karni padegi ek baar postman se 

    res.send("note created");
})

app.get("/notes",(req,res)=>{
    res.send(notes);
})


app.listen(3000, ()=>{
    console.log("Server is running on port 3000");
})