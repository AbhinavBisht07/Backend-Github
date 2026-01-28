// app.js ke 2 kaam hote hain :-
// Server ko create karna 
// Server ko ciinfigure karna 

const express = require("express");

const app = express(); //server(instace) created

app.use(express.json());


const notes = [];

// POST /notes
app.post("/notes", (req,res)=>{
    // console.log(req.body);
    notes.push(req.body);
    // console.log(notes);
    
    // res.send("Note created");
    res.status(201).json({
        message: "Note created successfully"
    })
})

// GET /notes
app.get("/notes", (req,res)=>{
    res.status(200).json({
        notes: notes //notes ka data display hojaega response mein
    })
})

// DELETE /notes/:index
app.delete("/notes/:index", (req,res)=>{
    delete notes[req.params.index]

    res.status(204).json({
        message: "Note deleted successfully" 
    })
})

// PATCH /notes/:index
app.patch("/notes/:index", (req,res)=>{
    notes[req.params.index].description = req.body.description

    res.status(200).json({
        message: "Note updated successfully"
    })
})

module.exports = app