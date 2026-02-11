const express = require("express");
const userModel = require("../models/user.model") //see kese humne dot slash use ni kiya but double dot slash use kiya ... as we know double dots humke ek directory peeche le jaata hai .... hum abhi routes wali directory ke andar hain ... double dots ka use karke hum src folder ke andar aagye...
const jwt = require("jsonwebtoken")

const authRouter = express.Router(); // ek router create kar diya authRouter naam se...
// Agar app.js ke alawa kisi aur file mein API create karni hai to humko Express router ka use karna padta hai
const crypto = require("crypto");


// /api/auth/register 
authRouter.post("/register", async (req, res) => {
    const { name, email, password } = req.body;

    //if user already exist karta hai iss email se to we will simply return a response "user already exits with this email" :-
    const userAlreadyExists = await userModel.findOne({ email })
    // console.log(userAlreadyExists);
    if (userAlreadyExists) {
        return res.status(409).json({
            message: "A user already exists with this email address",
        })
    }

    // Password ko hash mein convert karenge DB mein store karne se pehle :-
    const hash = crypto.createHash("md5").update(password).digest("hex");

    // agar user exist nahi karta we will store user data(along with hashed password ... not plain password) in the DB
    const user = await userModel.create({
        name, email, password: hash
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


// /api/auth/protected
// dummy api h ye wese :-
authRouter.get("/protected", (req,res)=>{
    console.log(req.cookies);
    // console.log(req.cookies.jwt_token);

    res.status(200).json({
        message: "This is a protected route"
    })
})


// POST /api/auth/login
// Controller
authRouter.post("/login", async (req,res) =>{
    const { email, password } = req.body; 

    // checking kya user exist karta hai ?? ... agar nahi karta to yahin se wapsi return hojaenge with a message - "user not found wth this email" :-
    const user = await userModel.findOne( {email} );
    if(!user){
        return res.status(404).json({
            message: "User not found with this email address"
        })
    }

    // agar user exist karta hai then we are checking ki kya password sahi daal raha hai client apne account ka ?? ... agar galat daal ra to yahin se return hojana with a message "incorrect password"
    // ab hashing seekh li to hum passwords ke hash ko compare karenge naa ki passwords ko ...
    const hash = crypto.createHash("md5").update(password).digest("hex"); //new line
    // const isPasswordMatched = user.password === password; //old line
    const isPasswordMatched = user.password === hash; //new line
    if(!isPasswordMatched){
        return res.status(401).json({
            message: "Invalid password"
        })
    }

    // agar email and password dono sahi hain ... to hum ek NEW TOKEN create kar denge user ke liye :-
    const token = jwt.sign(
        { id: user._id },
        process.env.JWT_SECRET
    )

    // token ko cookie storage mein set kar denge :-
    res.cookie("jwt_token", token);

    // At last login ka response bhej denge ki bhaiya kya status raha tumhare login ka :-
    res.status(200).json({
        message: "User logged in successfully",
        user,
        token
    })
})


module.exports = authRouter //router ko export kar diya...