import express from "express";
import morgan from "morgan";
import { sendEmail } from "./email.js";
import channel from "./mq.js";

const app = express();
app.use(morgan('dev'));


app.get('/', (req,res)=>{
    res.send('Hello from Notification Service');
})

app.get("/_status/healthz", (req,res)=>{
    res.status(200).json({status:"ok"});
})

app.get("/_status/readyz", (req,res)=>{
    res.status(200).json({status:"ready"});
})



channel.consume('auth_notification_queue', async(msg)=>{
    if(msg !== null) {
        const messageContent = msg.content.toString();
        console.log('Recieved message from queue', messageContent);

        try{
            const { userId, timestamp, email } = JSON.parse(messageContent);

            const subject = "New Login Notification"
            const text = `Hello, your account with ID ${userId} was accessed on ${timestamp}. If this wasn't you, please secure your account.`;
            const html = `<p>Hello,</p><p>Your account with ID <strong>${userId}</strong> was accessed on <strong>${timestamp}</strong>.</p><p>If this wasn't you, please secure your account.</p>`;

            await sendEmail(email, subject, text, html);

            channel.ack(msg); // acknowledgement bhejna jaruri hota hai .. kyuki agar noti service ne user ko mail bhej diya par queue ko acknowlegement nahi bheja to queue mein wo data still exist karega and wapas se noti service ko wo queue ko read karna padega(loop ban jaega basically)
        } catch(error){
            console.error('Error processing message:', error);
            // Optionally, you can choose to nack the message to requeue it
            // channel.nack(msg);
        }
    } else {
        console.log('Recieved null message')
    }
})


export default app;