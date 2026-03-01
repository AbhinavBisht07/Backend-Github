const userModel = require("../models/user.model");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const blacklistModel = require("../models/blacklist.model")
const redis = require("../config/cache");


async function registerUser(req,res){
    const { username, email, password } = req.body;

    const userAlreadyExits = await userModel.findOne({
        $or: [
            {username: username},
            {email: email}
        ]
    })

    if(userAlreadyExits){
        return res.status(400).json({
            message: `User already exists with this ${email === userAlreadyExits.email ? "email." : "username."}`
        })
    }

    const hash = await bcrypt.hash(password, 10);

    const user = await userModel.create({
        username, email, password: hash
    })


    const token = jwt.sign(
        {id: user._id, username: user.username},
        process.env.JWT_SECRET,
        {expiresIn: "3d"}
    )
    res.cookie("token", token);

    return res.status(201).json({
        message: "User registered successfully",
        user: {
            id: user._id,
            username: user.username,
            email: user.email
        }
    })
}


async function loginUser(req,res){
    const {email, username, password} = req.body;

    const user = await userModel.findOne({
        $or: [
            {email},
            {username}
        ]
    }).select("+password");

    // task 2: why we are not giving message "404 user not found" in this scenaro :-
    if(!user){
        return res.status(400).json({
            message: "Invalid credentials."
        })
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if(!isPasswordValid){
        return res.status(400).json({
            message: "Invalid credentials."
        })
    }

    const token = jwt.sign(
        {id: user._id, username: user.username},
        process.env.JWT_SECRET,
        {expiresIn: "3d"}
    )
    res.cookie("token", token);

    return res.status(200).json({
        message: "User logged in successfully.",
        user: {
            id: user._id,
            username: user.username,
            email: user.email
        }
    })
}


async function getMe(req,res){
    const user = await userModel.findById(req.user.id).select("-password")

    res.status(200).json({
        message: "User fetched successfully.",
        user
    })
}


async function logoutUser(req,res){
    const token = req.cookies.token;

    // Remove token from client side :-
    res.clearCookie("token");

    // blacklisting token(creating blacklist collection in mongoDB):-
    // await blacklistModel.create({
    //     token
    // })

    // blacklisting token(in Redis):-
    await redis.set(token, Date.now().toString(), "EX", 60 * 60);


    res.status(200).json({
        message: "User logged out successfully."
    })
}


module.exports = {
    registerUser,
    loginUser,
    getMe,
    logoutUser
}