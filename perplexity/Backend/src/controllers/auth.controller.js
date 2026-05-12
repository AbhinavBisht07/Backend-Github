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
    try {
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


        const user = await userModel.create({ username, email, password });

        const emailVerificationToken = jwt.sign(
            { email: user.email },
            process.env.JWT_SECRET,
        )

        // fire and forget email sending to prevent timeout in production
        sendEmail({
            to: email,
            subject: "Welcome to Perplexity",
            html: `<p>Hi ${username},</p>
               <p>Thank you for registering at <strong>Perplexity</strong>. We're excited to have you on board!</p>
               <p>Please verify your email adress by clicking the link below:</p>
               <a href="https://perplexity-clone-9lkm.onrender.com/verify-email?token=${emailVerificationToken}">Verify Email</a>
               <p>If you did not create an account, please ignore this email.</p>
               <p>Best regards,<br>The Perplexity Team</p>`
        }).catch(err => {
            console.error("Delayed Email Sending Error:", err);
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
    } catch (err) {
        console.error("REGISTRATION ERROR:", err);
        res.status(500).json({
            message: "Internal server error during registration",
            success: false,
            err: err.message
        })
    }
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

        return res.status(200).json({
            message: "Email verified successfully",
            success: true
        })
    }

    catch (err) {
        return res.status(400).json({
            message: "Invalid or expired token",
            success: false,
            err: err.message
        })
    }
}