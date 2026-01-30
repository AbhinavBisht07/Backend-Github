// create server 
// config server 

// const express = require("express");
// const noteModel = require("./models/notes.model");

// const app = express();

// app.use(express.json()); // middleware(that reads the request stream, parses JSON, and converts it into a JavaScript object)

// // POST /notes
// // req.body => {title,description}
// app.post("/notes", (req, res) => {
//     const { title, description } = req.body;

//     // noteModel.create({
//     //     title: title,
//     //     description: description,
//     // })
//     // OR WE CAN ALSO WRITE LIKE THIS :-
//     noteModel.create({
//         title, description
//     })
// })

// module.exports = app;








const express = require("express");
const noteModel = require("./models/notes.model");

const app = express();

app.use(express.json()); // middleware(that reads the request stream, parses JSON, and converts it into a JavaScript object)

// POST /notes
// req.body => {title,description}
app.post("/notes", async (req, res) => {
    const { title, description } = req.body;

    const note = await noteModel.create({
        title, description
    })

    res.status(201).json({
        message: "Note create successfully",
        note: note,
    })
})

// GET /notes
// fetch all the notes data 
app.get("/notes", async (req, res)=>{
    const notes = await noteModel.find()

    res.status(200).json({
        message: "Notes fetched successfully",
        notes: notes
    })
})

// PATCH /notes/:index
// app.post("/notes/:index", (req, res)=>{})

// DELETE /notes/:index
// app.post("/notes/:index", (req, res)=>{})

module.exports = app;