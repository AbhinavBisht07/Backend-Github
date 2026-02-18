const mongoose = require("mongoose");


async function connectToDatabase(){
    mongoose.connect(process.env.MONGO_URI)
    .then(()=>{
        console.log("Connected to MongoDB");
    })
}

module.exports = connectToDatabase