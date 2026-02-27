const {Router} = require("express");
const authController = require("../controllers/auth.controller");

const authRouter = Router();


/**
 * @route POST /api/auth/register
 * @description register the user . Using username, email password from req.body
 */
authRouter.post("/register", authController.registerUser);

/**
 * @route POST /api/auth/login
 * @description login the user . Using username, email, password from req.body
 */
authRouter.post("/login", authController.loginUser);



module.exports = authRouter;