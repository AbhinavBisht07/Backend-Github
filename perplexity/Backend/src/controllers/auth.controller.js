import userModel from "../models/user.model.js";
import jwt from "jsonwebtoken";
import { sendEmail } from "../services/mail.service.js";
import blacklistModel from "../models/blacklist.model.js";
import redis from "../config/cache.js";

/**
 * @route POST /api/auth/register
 * @description Register a new user
 * @access Public
 * @body { username, email, password }
 */
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

    // filhaal email ke base pe create kar re token .. email bhi unique hota kyuki ..
    const emailVerificationToken = jwt.sign(
        { email: user.email },
        process.env.JWT_SECRET,
    )

    await sendEmail({
        to: email,
        subject: "Welcome to Perplexity",
        // text optional rehta hai ..agar html bhej re to text ki jarurat nahi rehti 
        // text: `Hi ${username},\n\nThank you for registering at Perplexity. We're excited to have you on board!\n\nBest regards,\nThe Perplexity Team`,
        html: `<p>Hi ${username},</p>
               <p>Thank you for registering at <strong>Perplexity</strong>. We're excited to have you on board!</p>
               <p>Please verify your email adress by clicking the link below:</p>
               <a href="http://localhost:5173/verify-email?token=${emailVerificationToken}">Verify Email</a>
               <p>If you did not create an account, please ignore this email.</p>
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


/**
 * @route POST /api/auth/login
 * @description  Login user and return JWT token
 * @access Public
 * @body { email, password }
 */
export async function login(req, res) {
    const { email, password } = req.body;

    const user = await userModel.findOne({ email })

    if (!user) {
        return res.status(400).json({
            message: "Invalid email or password",
            success: false,
            err: "User not found"
        })
    }

    const passwordMatched = await user.comparePassword(password);

    if (!passwordMatched) {
        return res.status(400).json({
            message: "Invalid email or password",
            success: false,
            err: "Incorrect password"
        })
    }

    // verified field agar false hogi to token generate karne nahi denge ... yahi se wapsi return kar denge user ko .. and agar token generate nahi hoga to user kisi bhi feature ko access nahi kar paega kyuki har feature ko access karne ke liye ek req bhejni padegi and req mein token hona jaruri hota hai(basics) ...
    if (!user.verified) {
        return res.status(400).json({
            message: "Please verify your email before logging in.",
            success: false,
            err: "Email not verified"
        })
    }

    const token = jwt.sign(
        {
            id: user._id,
            username: user.username,
        },
        process.env.JWT_SECRET,
        { expiresIn: '7d' }
    )

    res.cookie("token", token)

    res.status(200).json({
        message: "Login successfull.",
        success: true,
        user: {
            id: user._id,
            username: user.username,
            email: user.email
        }
    })
}


/**
 * @route POST /api/auth/login
 * @description  Login user and return JWT token
 * @access Public
 * @body { email, password }
 */
export async function logout(req, res) {
    try {
        const token = req.cookies.token;

        if (!token) {
            return res.status(401).json({
                message: "Unauthorized",
                success: false,
                err: "No token provided"
            })
        }

        // blacklisting token :-
        // await blacklistModel.create({ token }, {expiresIn: "1d"});
        await redis.set(token, Date.now().toString(), "EX", 60 * 60 * 24 * 7);

        // remove token from client side :-
        res.clearCookie("token");

        res.status(200).json({
            message: "User logged out successfully."
        })
    } catch (err) {
        res.status(500).json({
            message: "Internal server error",
            success: false,
            err: err.message
        })
    }
}



/**
 * @route GET /api/auth/get-me
 * @desc Get current logged in user's details
 * @access Private
 */
export async function getMe(req, res) {
    const userId = req.user.id;

    const user = await userModel.findById(userId).select("-password");

    if (!user) {
        return res.status(404).json({
            message: "User not found",
            success: false,
            err: "User not found"
        })
    }

    res.status(200).json({
        message: "User details fetched successfully",
        success: true,
        user
    })
}


/**
 * @route GET /api/auth/verify-email
 * @description Verify user's email address
 * @access Public
 * @body { token }
 */
export async function verifyEmail(req, res) {
    const { token } = req.query;

    try {
        // decoded mein wo user ki email ajaegi 
        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        // uss eemail ke base pe user ko find karenge 
        const user = await userModel.findOne({
            email: decoded.email
        })

        // agar user nahi mila :-
        if (!user) {
            return res.status(400).json({
                message: "Invalid token",
                success: false,
                err: "User not found"
            })
        }

        // agar mil gaya to verified field true kar denge :-
        user.verified = true;

        // save kar lenge :-
        await user.save();

        // ab jab verify kar diya humne user ko to usko ek proper page dikhaenge hum ki bhaiya verification hogyi hai aapki .. ab aap dashboar ki taraf badh sakte ho .. etc..
        const html =
            `<h1>Email Verified Successfully!</h1>
            <p>Your email has been verifiied. You can now log in to your account.</p>
            <a href="http://localhost:3000/api/auth/login">Go to Login</a>`

        return res.send(html)
    }

    catch (err) {
        return res.status(400).json({
            message: "Invalid or expired token",
            success: false,
            err: err.message
        })
    }
}