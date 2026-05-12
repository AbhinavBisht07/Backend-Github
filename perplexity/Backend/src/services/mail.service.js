import { google } from "googleapis";

// const transporter = nodemailer.createTransport({
//     host: "smtp.gmail.com",
//     port: 587,
//     secure: false, // Use STARTTLS
//     requireTLS: true,
//     family: 4,    // Force IPv4
//     auth: {
//         type: "OAuth2",
//         user: process.env.GOOGLE_USER,
//         clientSecret: process.env.GOOGLE_CLIENT_SECRET,
//         refreshToken: process.env.GOOGLE_REFRESH_TOKEN,
//         clientId: process.env.GOOGLE_CLIENT_ID,
//         redirectUri: "https://developers.google.com/oauthplayground"
//     },
//     connectionTimeout: 10000,
//     greetingTimeout: 10000,
//     socketTimeout: 15000,
//     logger: true, // Enable logging
//     debug: true,  // Enable debugging
// })

// Google OAuth2 Configuration
const oAuth2Client = new google.auth.OAuth2(
    process.env.GOOGLE_CLIENT_ID,
    process.env.GOOGLE_CLIENT_SECRET,
    "https://developers.google.com/oauthplayground"
);

oAuth2Client.setCredentials({
    refresh_token: process.env.GOOGLE_REFRESH_TOKEN
});

const accessToken = await oAuth2Client.getAccessToken();
console.log(accessToken);

const gmail = google.gmail({ version: "v1", auth: oAuth2Client });

// Function to encode email to base64url (required by Gmail API)
const encodeMessage = (message) => {
    return Buffer.from(message)
        .toString("base64")
        .replace(/\+/g, "-")
        .replace(/\//g, "_")
        .replace(/=+$/, "");
};

// ab transporter kindof ready hai .. but ek baar humko verify karna padta hai ki connection bana bhi ki nahi bana
// transporter.verify()
//     .then(() => {
//         console.log("✅ SUCCESS: Email transporter is ready.");
//     })
//     .catch((err) => {
//         console.error("❌ ERROR: Email transporter verification failed!");
//         console.error("Details:", err.message);
//     });


// Jo further communication hoga wo bhi humara transporter handle karega kuch ese :-
// to -> kisko bhejna , subject -> subject kya hai email ka, html -> jo humare emails hote hain unko html format mein send kiya jaata hai ... hum jab likhte hain to hum to plain text mein likhte hain   ... lekin emails jab transfer hote hainto wo text format mein hote hain ...
export async function sendEmail({ to, subject, html, text }) {
    console.log(`✉️ Attempting to send email to: ${to} using Gmail API (HTTP)`);

    const utf8Subject = `=?utf-8?B?${Buffer.from(subject).toString("base64")}?=`;
    const messageParts = [
        `From: Perplexity <${process.env.GOOGLE_USER}>`,
        `To: ${to}`,
        `Content-Type: text/html; charset=utf-8`,
        `MIME-Version: 1.0`,
        `Subject: ${utf8Subject}`,
        "",
        html || text,
    ];
    const message = messageParts.join("\n");

    try {
        const encodedMessage = encodeMessage(message);
        const res = await gmail.users.messages.send({
            userId: "me",
            requestBody: {
                raw: encodedMessage,
            },
        });
        console.log("✅ Email sent successfully via Gmail API:", res.data.id);
    } catch (error) {
        console.error("❌ Failed to send email via Gmail API:");
        console.error("Full error:", error);
        if (error.message.includes("invalid_grant")) {
            console.error("Authentication failed. Refresh token might be expired or missing 'gmail.send' scope.");
        }
    }
}