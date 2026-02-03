// Server ko create karna 
// Server ko config karna

const express = require("express");
const noteModel = require("./models/note.model")
const cors = require("cors")
const path = require("path")


const app = express()
app.use(cors()) ; //server starts accepting cross origin requests ..
app.use(express.json()) // middleware
app.use(express.static("./public")) //middleware


// - POST /api/notes
// - create new note and save in mongodb
// - req.body = {title, description}
app.post("/api/notes", async (req,res)=>{
    const { title, description } = req.body;

    const note = await noteModel.create({
        title: title, 
        description: description
    })

    res.status(201).json({
        message: "Note created successfully",
        note: note
    })
})

// - GET  /api/notes
// - Fetch all the notes data from mongodb and send them in response
app.get("/api/notes", async (req,res)=>{
    const notes = await noteModel.find();

    res.status(200).json({
        message: "Notes fetched successfully",
        notes: notes
    })
})

// - DELETE /api/notes/:id
// - Delete note with the id from req.params
app.delete("/api/notes/:id", async (req,res)=>{
    const id = req.params.id

    await noteModel.findByIdAndDelete(id);

    res.status(200).json({
        message: "Note deleted successfully"
    })
})

// - PATCH /api/notes/:id
// - Update the description of a note
// - req.body = { description }
app.patch("/api/notes/:id", async (req,res)=>{
    const id = req.params.id;
    const { description } = req.body;

    await noteModel.findByIdAndUpdate(id, { description });

    res.status(200).json({
        message: "Note updated successfully",
    })
})


app.use("*name", (req,res)=>{
    // res.send("this is wild card");
    // res.sendFile(`C:\Users\Abhinav Bisht\Desktop\COHORT 2.0\3.Back-End\Backend-Github\day-9\Backend\src\app.js`);
    // res.sendFile(`C:/Users/Abhinav Bisht/Desktop/COHORT 2.0/3.Back-End/Backend-Github/day-9/Backend/src/app.js`);

    res.sendFile(path.join(__dirname, "..", "/public/index.html"))
})

module.exports = app