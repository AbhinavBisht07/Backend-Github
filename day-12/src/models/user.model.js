const mongoose = require("mongoose");

//Schema create karte hain format batane ke liye
const userSchema = new mongoose.Schema({
    name: String,
    email: {
        type: String,
        unique: [true, "With this email a user account already exists."]
    },
    password: String
}) 

// Model create karte hain kuch bhi operations performm karne ke liye user ke ooper
const userModel = mongoose.model("users", userSchema);


module.exports = userModel