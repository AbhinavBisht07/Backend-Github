const Redis = require("ioredis").default //.default lagane se humko redis se related suggestions aane chaalu hojaenge ...(agar import kar rahe hote to .default lagane ki jarurat nahi padti ..lekin hum require kar rahe hain to jarurt paegi .default ki suggestions ke liye)

const redis = new Redis({
    host: process.env.REDIS_HOST,
    port: process.env.REDIS_PORT,
    password: process.env.REDIS_PASSWORD
})

redis.on("connect", ()=>{
    console.log("Server is connected to Redis");
})

redis.on("error", (err)=>{
    console.log(err);
})

module.exports = redis;