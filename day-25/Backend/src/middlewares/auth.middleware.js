const blacklistModel = require("../models/blacklist.model");
const userModel = require("../models/user.model");
const redis = require("../config/cache");
const jwt = require("jsonwebtoken");


async function authUser(req,res,next){
    const token = req.cookies.token;
    if(!token){
        return res.status(401).json({
            message: "Token not provided."
        })
    }

    // const isTokenBlacklisted = await blacklistModel.findOne({
    //     token
    // })
    // if(isTokenBlacklisted){
    //     return res.status(401).json({
    //         message: "Invalid token"
    //     })
    // }
    const isTokenBlacklisted = await redis.get(token); //key ke base pe get karte hain 
    if(isTokenBlacklisted){
        return res.status(401).json({
            message: "Invalid token"
        })
    }

    let decoded = null;
    try{
        decoded = jwt.verify(token, process.env.JWT_SECRET)

        req.user = decoded;
        next();
    }
    catch(err){
        return res.status(401).json({
            message: "Invalid token."
        })
    }

}


module.exports = {
    authUser
}