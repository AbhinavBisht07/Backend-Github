const mongoose = require("mongoose");


const userSchema = new mongoose.Schema({
    name: String,
    email: {
        type: String,
        unique: [true, "A user already exists with this email address"]
    },
    password: String
})


const userModel = mongoose.model("users", userSchema);


module.exports = userModel