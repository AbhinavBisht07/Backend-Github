import nodemailer from "nodemailer";

const transporter = nodemailer.createTransport({
    host: "smtp.gmail.com",
    port: 587,
    secure: false, // Use STARTTLS
    requireTLS: true,
    family: 4,    // Force IPv4
    auth: {
        type: "OAuth2",
        user: process.env.GOOGLE_USER,
        clientSecret: process.env.GOOGLE_CLIENT_SECRET,
        refreshToken: process.env.GOOGLE_REFRESH_TOKEN,
        clientId: process.env.GOOGLE_CLIENT_ID,
        redirectUri: "https://developers.google.com/oauthplayground"
    },
    connectionTimeout: 10000,
    greetingTimeout: 10000,
    socketTimeout: 15000,
    logger: true, // Enable logging
    debug: true,  // Enable debugging
})

// ab transporter kindof ready hai .. but ek baar humko verify karna padta hai ki connection bana bhi ki nahi bana
transporter.verify()
    .then(() => {
        console.log("✅ SUCCESS: Email transporter is ready.");
    })
    .catch((err) => {
        console.error("❌ ERROR: Email transporter verification failed!");
        console.error("Details:", err.message);
    });


// Jo further communication hoga wo bhi humara transporter handle karega kuch ese :-
// to -> kisko bhejna , subject -> subject kya hai email ka, html -> jo humare emails hote hain unko html format mein send kiya jaata hai ... hum jab likhte hain to hum to plain text mein likhte hain   ... lekin emails jab transfer hote hainto wo text format mein hote hain ...
export async function sendEmail({ to, subject, html, text }) {
    console.log(`✉️ Attempting to send email to: ${to}`);

    if (!process.env.GOOGLE_USER) {
        console.error("❌ ERROR: GOOGLE_USER environment variable is missing!");
        return;
    }

    const mailOptions = {
        from: process.env.GOOGLE_USER,
        to,
        subject,
        html,
        text,
    };

    try {
        const details = await transporter.sendMail(mailOptions);
        console.log("✅ Email sent successfully:", details.messageId);
    } catch (error) {
        console.error("❌ Failed to send email via Nodemailer:");
        console.error("Error Message:", error.message);
        if (error.code === 'EAUTH') {
            console.error("Authentication failed. Refresh token might be expired.");
        }
    }
}