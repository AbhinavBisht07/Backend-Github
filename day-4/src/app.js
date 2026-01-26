// Server create karna
// Server config karna

const express = require("express");

const app = express(); //server(instance) create hogaya.

app.use(express.json());


const notes = [];


app.get("/",(req,res)=>{
    res.send("Hlo wrld");
})


//POST method ki /notes API
// request POST method ke /notes mein jaegi and response mein "note created" milega
app.post("/notes", (req,res)=>{
    console.log(req.body);

    notes.push(req.body);
    console.log(notes);

    res.send("note created");
})

//GET method ki /notes API
// request GET method ke /notes mein jaegi and response mein notes wala array of objects milega 
app.get("/notes",(req,res)=>{
    res.send(notes);
})
//dono APIs ke naam same hain(/notes) bas methods alag hain(post, get). 

//DELETE method ki /notes API
app.delete("/notes/:index",(req,res)=>{
    console.log(req.params.index);
    delete notes[req.params.index];

    res.send(`note at index ${req.params.index} deleted successfully`);
})
// see the notes for clarification.


// PATCH method ki /notes API
// "/notes/:index" mein jiss bhi ndex ke data ko update karna wo bhejenge
// req.body ke andar data rahega(updated data rahega mtlb ... jo bhi user updated data bhejega wo rahega iske andar .. fir hum udated data ko original data mein daal denge ya replace kar denge).
app.patch("/notes/:index", (req,res)=>{

    notes[req.params.index].description = req.body.description;

    res.send("Note updated successfully");
})

module.exports = app; //export kar diya server ko app.js file se