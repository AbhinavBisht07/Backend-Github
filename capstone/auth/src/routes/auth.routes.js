import { Router } from "express";
import User from "../models/user.model.js";
import passport from "passport";
import jwt from "jsonwebtoken";
import { sendAuthNotification } from "../config/mq.js";

const router = Router();

router.get('/google', passport.authenticate('google', {
    session: false,
    scope: ['profile', 'email']
}));

router.get('/google/callback', passport.authenticate('google', {
    session: false,
    failureRedirect: '/'
}), async (req, res) => {
    try {
        const { id, displayName, emails, photos } = req.user;
        let user = await User.findOne({ googleId: id });

        // mq.js
        await sendAuthNotification({
            userId: user._id,
            action: 'google_login',
            timestamp: new Date(),
            emails: emails[0].value
        })

        if (!user) {
            user = new User({
                googleId: id,
                email: emails[0].value,
                name: displayName,
                avatar: photos[0].value
            });
            await user.save();
        }

        // Generate JWT token
        const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '1d' });

        // set token in cookie
        res.cookie('token', token);
        res.redirect('http://localhost:5173'); // Redirect to frontend after successful login
    } catch (err) {
        console.error('Error during Google authentication:', err);
        res.redirect('/'); //Redirect to frontend on error
    }
})


export default router;