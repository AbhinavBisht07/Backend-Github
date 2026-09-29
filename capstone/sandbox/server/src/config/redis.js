import Redis from 'ioredis';
import { deletePod } from '../kubernetes/pod.js';
import { deleteService } from '../kubernetes/service.js';

// we will create 2 instances of reddis :-
const redis = new Redis(process.env.REDIS_URL);
const subscriber = new Redis(process.env.REDIS_URL);

export async function createSandboxKey(sandboxId) {
    // jab bhi redis mein koi key create karenge hum to uski value deni padti hai .... to abhi ke liye humne iski value mein staus: "active" de diya
    await redis.set(`sandbox:${sandboxId}`, JSON.stringify({
        status: 'active'
    }), "EX", 120);
    // abhi ke liye expiry 120 seconds ki dedi humne
}
// ye function bascally ye karega ki jab bhi ek sandbox create hora hoga uss time pe hum iss function ko call kar denge to ye function chal jaega and redis meinn jaake ek key create kar dega .. jo 120 seconds mein exire ho jaegi ..


// ye basically ye bol raha hai ki jab bhi reddis koi bhi key-expiry event bheje to usko listen karega humara subscribe :-
subscriber.config('SET', 'notify-keyspace-events', 'Ex');
// kin events ko suunege ?? jo events key-expire wale events honge honge bas unko sunenge :-
subscriber.subscribe('__keyevent@0__:expired')

// jab bhi subscrber pe koi event(message) aega to ye function ke andar ka code execute hojaega :-
// subscriber.on('message', async (channel, key)=> {
//     console.log(`Key expired: ${key}`);
//     // skaffold terminal :- 
//     // [main-sandbox-container] Key expired: sandbox: 01a0d318-2611-768b-9cc6-4412a5c68537

//     const sandboxId = key.split(':')[1];

//     // Delete the associated Kubernetes Pod and Service 
//     await deletePod(sandboxId);
//     await deleteService(sandboxId);
// }) 


subscriber.on('message', async (channel, key) => {

    console.log(`Key expired: ${key}`);

    const sandboxId = key.split(':')[1];

    try {
        console.log(`Deleting pod: sandbox-pod-${sandboxId}`);

        await deletePod(sandboxId);

        console.log(`Pod deleted: sandbox-pod-${sandboxId}`);

        console.log(`Deleting service: sandbox-service-${sandboxId}`);

        await deleteService(sandboxId);

        console.log(`Service deleted: sandbox-service-${sandboxId}`);

    } catch (error) {
        console.error("Failed to delete sandbox:", error);
    }
});


export default { subscriber }
// ab inko app.js mein import karenge 