import { Router } from "express";
import { validateRegisterUser, validateLoginUser } from "../validator/auth.validator.js";
import { register, login, googleCallback } from "../controllers/auth.controller.js";
import passport from "passport";
import { Config } from "../config/config.js";
import { config } from "dotenv";

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

export default router;