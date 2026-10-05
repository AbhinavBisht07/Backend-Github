import mongoose from "mongoose";


const projectSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        // ref: 'User' //generally dete the hum ye .. but refrence nahi de sakte hum iss project mein kyuki sab services ke database alag alag create kar rakhe hain humne (microservices) .. to they wont be able to access each other
    },
    title: {
        type: String,
        default: "Untitled Project"
    }
});



const Project = mongoose.model('projet', projectSchema);

export default Project;