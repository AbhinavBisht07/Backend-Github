import mongoose from "mongoose";
import bcrypt from "bcryptjs";

const userSchema = new mongoose.Schema(
    {
        username: {
            type: String,
            required: true,
            trim: true,
            unique: true
        },
        email: {
            type: String,
            required: true,
            trim: true,
            unique: true,
            lowercase: true
        },
        password: {
            type: String,
            required: true,
            minlength: 6,
        },
        verified: {
            type: Boolean,
            default: false,
        }
    },
    { timestamps: true }
)

userSchema.pre('save', async function (next){
    if(!this.isModified('password')) return next();

    this.password = await bcrypt.hash(this.password, 10);
});

// ye hum ek custom method create kar rahe .. and ye custom method hum uss user pe use kar sakte hain jo humne find kiya hai userModel ki help se(controller mein)  
userSchema.methods.comparePassword = function (candidatePassword) {
    return bcrypt.compare(candidatePassword, this.password);
}

/**
 * suppose ye user find kara humne :-
 * const user = await usermodel.findOne({email: 'test@test.com})
 * 
 * ab iss user pe hum wo custom method use kar sakte humari (ya bol sakte hain iss user ke paas uss custom method ka access rehta hai) :-
 * user.comparePassword('candidatePassword').then(isMatch =>{})
 * 
 */

const userModel = mongoose.model("users", userSchema);

export default userModel;