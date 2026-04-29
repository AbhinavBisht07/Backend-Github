import { body, validationResult } from "express-validator"; 

const validate = (req, res, next) => {
    const errors = validationResult(req);

    // agar empty hai errors .. to request ko controller pe bhej do 
    if (errors.isEmpty()) {
        return next();
    }

    // and agar empty nahi hai t yahin se resposnse return kardo user ko ki tuhare data ka format galat hai ..
    return res.status(400).json({
        errors: errors.array() //errors ko array format mein return karwa denge hum ...
    })
}

export const registerValidation = [
    body("username").isString().withMessage("username should be a string"),
    body("email").isEmail().withMessage("email should be a valid email address"),
    body("password").isLength({ min:6 }).withMessage("password should be between 6 and 12 characters in length") ,
    validate
]