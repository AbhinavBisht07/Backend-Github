import mongoose from "mongoose";
import bcrypt from "bcryptjs";

const userSchema = new mongoose.Schema({
    email: { type: String, required: true, unique: true },
    contact: { type: String, required: true },
    password: { type: String, required: true },
    fullname: { type: String, required: true },
    role: {
        type: String,
        enum: ["buyer", "seller"],
        default: "buyer"
    }
});

// ye jo humara pre middleware rehta hai wo database mein kuch bhi data save karne se pehle ye callback chala dega....
userSchema.pre("save", async function(){
    if(!this.isModified("password")) return; 

    const hash = await bcrypt.hash(this.password, 10);
    this.password = hash;
})

userSchema.methods.comparePassword = async function(password) {
    return await bcrypt.compare(password, this.password);
}

const userModel = mongoose.model("users", userSchema);

export default userModel;