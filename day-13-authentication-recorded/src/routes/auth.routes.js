const express = require("express")
const authRouter = express.Router(); //creating router
const userModel = require("../models/user.model");
const crypto = require("crypto");
const jwt = require("jsonwebtoken");



// POST /register
// /api/auth/register
// register user 
authRouter.post("/register", async (req,res)=>{
    const { name, email, password } = req.body;

    // checking if user already exists :-
    const userAlreadyExists = await userModel.findOne({email});

    // if user already exists return with a response
    if(userAlreadyExists){
        return res.status(409).json({
            message: "A user already exists with this email address"
        })
    }

    // if user doesnt exist hash the password and store user data in db
    const hash = crypto.createHash("md5").update(password).digest("hex");

    const user = await userModel.create({
        name, email, password: hash
    })

    //create token and sign it with JWT_SECRET
    const token = jwt.sign(
        { id: user._id },
        process.env.JWT_SECRET,
        { expiresIn: "1h" }  // new topic added
    )

    // store token in cookie storage
    res.cookie("token", token)


    // at last send final response :-
    res.status(201).json({
        message: "User registered successfully",
        user: {
            name: user.name,
            email: user.email
        }
    })
})


//new api :- Implementing AUTHENTICATION 
// GET /get-me
// /api/auth/get-me
// accesses token and data of user through that token
authRouter.get("/get-me", async (req,res)=>{
    // iski help se server access karta hai token ko :-
    const token = req.cookies.token

    // verifying token if it was created by our server only (checking if token is fake or tampered with)... and at last returns a decoded playload
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // console.log(decoded.id); // we can see ye request send karne pe ek object print hoga jisme id mention hogi user ki 
    // isi id ke base pe user ko find karenge 

    // finding user on the base of this id :-
    const user = await userModel.findById(decoded.id);

    res.json({
        name: user.name,
        email: user.email
    })
})


// GET /protected
// /api/auth/protected
// a dummy API to show how server accesses token
// authRouter.get("/protected", (req,res)=>{
//     console.log(req.cookies.token);
// })


// POST /login
// /api/auth/login
// login user
authRouter.post("/login", async (req,res)=>{
    const { email, password } = req.body;

    //check if user exists with entered email :-
    const user = await userModel.findOne({email});

    // if user doesnt exist return response that user not found
    if(!user){
        res.status(404).json({
            message: "User not found"
        })
    }

    // if user exists, check whether entered password's hash matches stored hashed password.
    const hash = crypto.createHash("md5").update(password).digest("hex");
    const isPasswordMatched =  user.password === hash;
    
    // if password doesnt match return response : invalid password
    if(!isPasswordMatched){
        res.status(401).json({
            message: "Invalid password"
        })
    }

    // if both conditions passed create token and store in cookie storage
    const token = jwt.sign(
        {id: user._id},
        process.env.JWT_SECRET,
        { expiresIn: "1h" }
    )

    res.cookie("token", token);


    // send final response :-
    res.status(200).json({
        message: "User logged in successfully",
        user: {
            name: user.name,
            email: user.email,
        }
    })
})



module.exports = authRouter