const mongoose = require("mongoose");

require('dotenv').config();

function connectToDb(){
    mongoose.connect(process.env.MONGODB_URI)
    .then(()=>{
        console.log("Connected to Database");
    })
}

module.exports = connectToDb

