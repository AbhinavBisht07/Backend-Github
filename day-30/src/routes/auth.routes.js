import { registerUser } from "../controllers/auth.controller.js";
import { Router } from "express";
import { registerValidation } from "../validation/auth.validator.js";


const authRouter = Router();


/**
 * @route POST /api/auth/register
 */
authRouter.post("/register", registerValidation, registerUser)

export default authRouter;
