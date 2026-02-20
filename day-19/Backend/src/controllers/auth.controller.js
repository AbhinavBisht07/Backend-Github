const userModel = require("../models/user.model");
// const crypto = require("crypto");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");


async function registerController(req,res){
    const { username, email, password, bio, profileImage } = req.body;

    // checking if a user already exists with same email or same username :-
    const doesUserAlreadyExist = await userModel.findOne({
        $or: [
            {username},
            {email}
        ]
    })
    if(doesUserAlreadyExist){
        return res.status(409).json({
            message: (doesUserAlreadyExist.email === email ? "A user already exists with this email address" : "A user already exists with this username"),
        })
    }

    // converting password to hash
    // const hash = crypto.createHash("sha256").update(password).digest("hex");
    const hash = await bcrypt.hash(password, 10);


    // creating user data in database :-
    const user = await userModel.create({
        username, 
        email, 
        password: hash, 
        bio, 
        profileImage
    })


    // creating and signing token :-
    const token = jwt.sign(
        {
            id: user._id,
            username: user.username
        },
        process.env.JWT_SECRET,
        { expiresIn: "1d" }
    )
    // storing token in cookie storage :-
    res.cookie("token", token);

    // final response :-
    res.status(201).json({
        message: "User registered successfully",
        user: {
            email: user.email,
            username: user.username,
            bio: user.bio,
            profileImage: user.profileImage
        }
    })
} 


async function loginController(req,res){
    const { username, email, password } = req.body

    // feature :- user 2 tareeke se login kar sakta hai either with email & password or with username & password.
    const user = await userModel.findOne({
        $or: [
            {
                // condition
                username: username // suppose test1 or undefined
            },
            {
                // condition
                email: email  // suppose test1@test.com or undefined
            }
        ]
    })

    if(!user){
        return res.status(404).json({
            message: "User not found with the entered email / username"
        })
    }


    // checking password :-
    // const hash = crypto.createHash("sha256").update(password).digest("hex");
    // const isPasswordValid = user.password === hash;
    const isPasswordValid = await bcrypt.compare(password, user.password);

    if(!isPasswordValid){
        return res.status(401).json({
            message: "Invalid password"
        })
    }

    // creating token if both email/username & password are valid :-
    const token = jwt.sign(
        {
            id: user._id,
            username: user.username
        },
        process.env.JWT_SECRET,
        { expiresIn: "1d" }
    )
    // storing token:-
    res.cookie("token", token);


    // final response:-
    res.status(200).json({
        message: "User logged in successfully",
        user: {
            username: user.baseModelName,
            email: user.email,
            bio: user.bio,
            profileImage: user.profileImage
        }
    })
} 


async function getMeController(req,res){
    const userId = req.user.id;
    
    const user = await userModel.findById(userId);

    res.status(200).json({
        message: "User details fetched successfully.",
        user: {
            username: user.username,
            email: user.email,
            bio: user.bio,
            profileImage: user.profileImage
        }
    })
}


module.exports = {
    registerController,
    loginController,
    getMeController
}