const mongoose = require("mongoose");


const userSchema = new mongoose.Schema({
    username: {
        type: String,
        unique: [true, "username already exists."],
        required: [true, "username is required."],
    },
    email: {
        type: String,
        unique: [true, "Email already exists."],
        required: [true, "Email is required"]
    },
    password: {
        type: String,
        required: [true, "Password is required"],
        select: false
    },
    bio: String,
    profileImage: {
        type: String,
        default: "https://ik.imagekit.io/abhinav007/default-user-img.jpg?updatedAt=1770741850588"
    }
})



const userModel = mongoose.model("users", userSchema)


module.exports = userModel