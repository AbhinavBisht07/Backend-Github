import mongoose from "mongoose";
import bcrypt from "bcryptjs";

const userSchema = new mongoose.Schema({
    email: { type: String, required: true, unique: true },
    contact: { type: String, required: false },
    password: { 
        type: String, 
        required: function() {
            return !this.googleId
        } // iska mtlba hai ki agar googleId exist karti hai to password required nahi hoga ... but agar nahi karti hai to password required hoga
    },
    fullname: { type: String, required: true },
    role: {
        type: String,
        enum: ["buyer", "seller"],
        default: "buyer"
    },
    googleId: { 
        type: String,
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