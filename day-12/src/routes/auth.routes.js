const express = require("express");
const userModel = require("../models/user.model") //see kese humne dot slash use ni kiya but double dot slash use kiya ... as we know double dots humke ek directory peeche le jaata hai .... hum abhi routes wali directory ke andar hain ... double dots ka use karke hum src folder ke andar aagye...
const jwt = require("jsonwebtoken")
const authRouter = express.Router(); // ek router create kar diya authRoutes naam se...
// Agar app.js ke alawa kisi aur file mein API create karni hai to humko Express router ka use karna padta hai


// /api/auth/register 
authRouter.post("/register", async (req, res) => {
    const { name, email, password } = req.body;

    const userAlreadyExists = await userModel.findOne({ email })

    if (userAlreadyExists) {
        return res.status(400).json({
            message: "A user already exists with this email address",
        })
    }

    const user = await userModel.create({
        name, email, password
    })

    const token = jwt.sign(
        {
            id: user._id,
            email: user.email 
        },
        process.env.JWT_SECRET
    )

    res.cookie("jwt_token", token)

    res.status(201).json({
        message: "User registered successfully",
        user,
        token
    })
})


module.exports = authRouter //router ko export kar diya...