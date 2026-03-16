import nodemailer from "nodemailer";


const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
        type: "OAuth2",
        user: process.env.GOOGLE_USER,
        clientSecret: process.env.GOOGLE_CLIENT_SECRET,
        refreshToken: process.env.GOOGLE_REFRESH_TOKEN,
        clientId: process.env.GOOGLE_CLIENT_ID,
    }
})

// ab transporter kindof ready hai .. but ek baar humko verify karna padta hai ki connection bana bhi ki nahi bana
transporter.verify()
.then(()=>{ console.log("Email transporter is ready to send emails.") })
.catch((err)=>{ console.log("Email transporter verification failed:", err) })


// Jo further communication hoga wo bhi humara transporter handle karega kuch ese :-
// to -> kisko bhejna , subject -> subject kya hai email ka, html -> jo humare emails hote hain unko html format mein send kiya jaata hai ... hum jab likhte hain to hum to plain text mein likhte hain   ... lekin emails jab transfer hote hainto wo text format mein hote hain ...
export async function sendEmail({to, subject, html, text}) {
    const mailOptions = {
        from: process.env.GOOGLE_USER,
        to,
        subject,
        html,
        text,
    };

    const details = await transporter.sendMail(mailOptions);
    console.log("Email sent:", details);
}