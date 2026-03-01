const {Router} = require("express");
const authController = require("../controllers/auth.controller");
const authMiddleware = require("../middlewares/auth.middleware");

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


/**
 * @route GET /api/auth/get-me
 * @description The user who is requesting, get his/her details...
 */
authRouter.get("/get-me", authMiddleware.authUser, authController.getMe)


/**
 * @route GET /api/auth/logout
 * @description Logout a user
 */
authRouter.get("/logout", authController.logoutUser);


module.exports = authRouter;