import express from "express";
import cookieParser from "cookie-parser";
import morgan from "morgan";
import authRouter from "./routes/auth.routes.js";
import cors from "cors";
import passport from "passport";
import { Strategy as GoogleStrategy } from "passport-google-oauth20";
import { Config } from "./config/config.js";

const app = express();

app.use(morgan("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(cors({
    origin: "http://localhost:5173",
    methods: ["GET", "POST", "PUT", "DELETE"],
    credentials: true
}));


app.use(passport.initialize());

passport.use(new GoogleStrategy(
    {
        clientID: Config.GOOGLE_CLIENT_ID,
        clientSecret: Config.GOOGLE_CLIENT_SECRET,
        callbackURL: "/api/auth/google/callback"
    },
    (accessToken, refreshToken, profile, done) => {
        // Here you can handle the user information returned by Google
        console.log("Google OAuth2 callback:", profile);
        done(null, profile);
    }
))



app.get("/", (req, res) => {
    res.status(200).json({
        message: "Server is running"
    })
})

app.use("/api/auth", authRouter)

export default app;