import Redis from 'ioredis';

const redis = new Redis(process.env.REDIS_URL);

redis.on('connect', ()=>{
    console.log("Connected to Redis successfully");
})

redis.on('error', (err)=>{
    console.error('Reddis connection error:', err);
})


export async function refreshTTL(sandboxId){
    // expire method is used to update the TTL of a redis key
    await redis.expire(`sandbox:${sandboxId}`, 120);
}
// ab app.js mein import kar denge iss function ko and wahan pe chala denge ... jahan pe bhi sandbox pod se related request aari hogi ... ab wo request bhale hi agent pe aari ho ya file se related aari ho .. jab tak wo request humare sandbox pod mein jaa rahi hai .. tab tab TTL refresh wala function chalega ..