import amqplib from "amqplib";


const QUEUE = "auth_notification_queue"; // humare queue ka naam rakh diya humne :- "auth_notification_quueue " 

// AMQP queue se connect karne ke liye hum connection create karte hain ... basically rabbitMQ and humare server ko yahi connection connect karta hai 
const connection = await amqplib.connect(process.env.RABBITMQ_URL);


// Then iss connection ke andar hum multiple channels create kar sakte hain and har ek channel se ek individual message bhej sakte hain .... jitne jada hum channel create karenge utne jada hum parallelly messages bhej paenge queue mein ...
// but ye generally recommended nahi hota .. thats why hum ekk hi channnel create karenge ..
const channel = await connection.createChannel();


// ab iss channel ko use karenge ... and queue assert karenge :-
channel.assertQueue(QUEUE, { durable: true });
// durable true bole to agar koi dikkat ajati hai and kisi wajeh se channel queue ko read nahi kar paata to queue ke andar se message delete nahi hoga ... matlab jab tak notification server queue ke message ko acknowledge nahi karta(read nahi karta) tab tak message exist karega queue ke andar(delete nahi hoga). 



// Neeche humne Buffer.from(JSON.stringfy()) kara to ye kya karta hai ?? ... it converts a JavaScript object or value into a JSON text string, and then transforms that text string into a binary data buffer.
// Ab esa isliye kara kyuki queue ke andar jitna bhi dta store hota hai wo binary format mein hota hai thats why karna pada binary format mein change pehle ...
export async function sendAuthNotification(message) {
    channel.sendToQueue(
        QUEUE,
        Buffer.from(JSON.stringify(message)),
        { persistent: true } // the message is marked for persistence, so RabbitMQ can preserve it across restarts.
    )
}


// Ab ye jo sendAuthNotification function hai iska use kahan and kab karenge ? ... app.routes.js mein karenge, jab koi bhi user register ya login kar raha hoga ..