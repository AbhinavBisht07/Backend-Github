const {Router} = require("express");
const authController = require("../controllers/auth.controller");
const authMiddleware = require("../middlewares/auth.middleware");

const router = Router();


/**
 * @route POST /api/auth/register
 * @description register the user . Using username, email password from req.body
 */
router.post("/register", authController.registerUser);

/**
 * @route POST /api/auth/login
 * @description login the user . Using username, email, password from req.body
 */
router.post("/login", authController.loginUser);


/**
 * @route GET /api/auth/get-me
 * @description The user who is requesting, get his/her details...
 */
router.get("/get-me", authMiddleware.authUser, authController.getMe)


/**
 * @route GET /api/auth/logout
 * @description Logout a user
 */
router.get("/logout", authController.logoutUser);


module.exports = router;