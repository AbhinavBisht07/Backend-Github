import { config } from "dotenv";
import express from "express";
import passport from "passport";
import { Strategy as GoogleStrategy } from "passport-google-oauth20";
import morgan from "morgan"

config();



const app = express();
app.use(morgan("dev"));


app.get("/", (req, res) => {
    res.send("Hello World");
})

app.use(passport.initialize());

passport.use(new GoogleStrategy(
    {
        clientID: process.env.GOOGLE_CLIENT_ID,
        clientSecret: process.env.GOOGLE_CLIENT_SECRET,
        callbackURL: "/auth/google/callback"
    },
    (_, __, profile, done) => {
        return done(null, profile);
    }
))
// agar humko passport ke sath google oauth setup karna hai to itna part humein likhna padega jisme clientID, clientSecret, callbackURL dena padta hai humko .... and also ek callback function bhi dena padta hai (ye bhi dena hi padta hai) ... kind of smjh lo ki mandatory hota hai ye piece of code jab hum passport google oauth setup kar rahe hote hain ...


// creating an API :-
// app.get("/auth/google", (req,res)=> {
//     console.log("with google")
// })
// ab google mein jaake search karo http://localhost:3000/auth/google and uske baad apna terminal check karenge to "with google" print hora hoga ...
// iska mtlb ye URL hit karne pe ye req,res wala callback chal raha hai ... aur yahi seekha bhi tha humne aajtak 
// to agar mein kuch esa likhu to iska mtlb hoga API hit karne pe andar wala code execute hora hoga :-
app.get("/auth/google", 
    passport.authenticate("google", {scope: ["profile", "email"] })
)
// passport.authenticate("google", {scope: ["profile", "email"] } .. is particular piece of code ka kaam hota hai client ko google ke server pe redirect karna ...
app.get("/auth/google/callback",
    passport.authenticate("google", { 
        session: false,
        failureRedirect: "/" 
    }),
    (req,res) => {
        console.log(req.user);
        res.send("Google authentication successful");
    }
)


app.listen(3000, () => {
    console.log("Server is running on port 3000");
})