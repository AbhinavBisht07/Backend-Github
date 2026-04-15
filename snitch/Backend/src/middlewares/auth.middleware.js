import jwt from "jsonwebtoken";
import { Config } from "../config/config.js";
import userModel from "../models/user.model.js";

export const authenticateSeller = async (req,res,next) => {
    const token = req.cookies.token;

    if(!token) {
        return res.status(401).json({message: "Unauthorized"})
    } 

    try{
        const decoded = jwt.verify(token, Config.JWT_SECRET);
        const user = await userModel.findById(decoded.id);

        if(!user){
            return res.status(401).json({message: "Unauthorized"})
        }

        if(user.role !== "seller"){
            return res.status(403).json({message: "Forbidden"})
        }

        // agar seller rahega :-
        req.user = user;
        next();

    }catch(err){
        return res.status(401).json({message: "Unauthorized"})
    }
} 