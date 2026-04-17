import { Router } from "express";
import { validateRegisterUser, validateLoginUser } from "../validator/auth.validator.js";
import { register, login, googleCallback, getMe } from "../controllers/auth.controller.js";
import passport from "passport";
import { Config } from "../config/config.js";
import { authenticateUser } from "../middlewares/auth.middleware.js";

const router = Router();


router.post("/register", validateRegisterUser, register);

router.post("/login", validateLoginUser, login);


router.get("/google",
    passport.authenticate("google", { scope: ["profile", "email"] }));

router.get("/google/callback",
    passport.authenticate("google", { 
        session: false, 
        failureRedirect: Config.NODE_ENV === "development" ? "http://localhost:5173/login" : "/login"
    }),
    googleCallback
)

/**
 * @route GET /api/auth/getMe
 * @description Get the current user
 * @access Private
 */
router.get('/getMe', authenticateUser, getMe)

export default router;