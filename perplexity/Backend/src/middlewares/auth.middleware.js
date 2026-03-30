import jwt from "jsonwebtoken";
import blacklistModel from "../models/blacklist.model.js";
import redis from "../config/cache.js";


export async function authUser(req, res, next) {
    const token = req.cookies.token;

    if (!token) {
        return res.status(401).json({
            message: "Unauthorized",
            success: false,
            err: "No token provided"
        })
    }

    let isTokenBlacklisted;
    try {
        isTokenBlacklisted = await redis.get(token);
    } catch (err) {
        console.error("Redis error:", err);
    }
    if (isTokenBlacklisted) {
        return res.status(401).json({
            message: "Unauthorized",
            success: false,
            err: "Invalid token"
        })
    }


    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        req.user = decoded;

        next();

    } catch (err) {
        return res.status(401).json({
            message: "Unauthorized",
            success: false,
            err: "Invalid token"
        })
    }
}