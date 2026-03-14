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

// verifying if connection established or not
transporter.verify()
// .then(()=>{ console.log("Email transporter is ready to send emails.") })
// .catch((err)=>{ console.log("Email transporter verification failed:", err) })


export async function sendEmail({to, subject, html, text=""}) {
    const mailOptions = {
        from: process.env.GOOGLE_USER,
        to,
        subject,
        html,
        text,
    };

    const details = await transporter.sendMail(mailOptions);
    console.log("Email sent:", details);

    // humesha dhyan rakha ye jo sendEmail wala functio hota hai ye kuch string return kar raha hota hai 
    return `Email sent successfully, to ${to}`
}