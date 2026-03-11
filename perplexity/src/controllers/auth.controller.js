import userModel from "../models/user.model.js";
import jwt from "jsonwebtoken";
import { sendEmail } from "../services/mail.service.js";


export async function register(req, res) {
    const { username, email, password } = req.body;

    const userAlreadyExists = await userModel.findOne({
        $or: [{ username }, { email }]
    })

    if (userAlreadyExists) {
        return res.status(400).json({
            message: `User already exists with this ${userAlreadyExists.email === email ? "email." : "username."}`,
            success: false,
            err: "User already exists"
        })
    }


    const user = await userModel.create({ username, email, password }); //password ko directly store karwa sakte kyuki user.model file mein dekhna ek midleware laga rakha humne ... jo user ka data database mein save hone se pehle chhalta hai .. and uss middleware mein password ko hash kar re hum ..

    await sendEmail({
        to: email,
        subject: "Welcome to Perplexity",
        // text optional rehta hai ..agar html bhej re to text ki jarurat nahi rehti 
        // text: `Hi ${username},\n\nThank you for registering at Perplexity. We're excited to have you on board!\n\nBest regards,\nThe Perplexity Team`,
        html: `<p>Hi ${username},</p>
               <p>Thank you for registering at <strong>Perplexity</strong>. We're excited to have you on board!</p>
               <p>Best regards,<br>The Perplexity Team</p>`
    })


    res.status(201).json({
        message: "User registered successfully",
        success: true,
        user: {
            id: user._id,
            username: user.username,
            email: user.email
        }
    })
}

