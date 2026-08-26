import Redis from "ioredis";

const redis = new Redis({
    host:process.env.REDIS_HOST,
    port:process.env.REDIS_PORT,
    password:process.env.REDIS_PASS,
})

redis.on("connect",()=>{
    console.log("redis is connected 😊")
})

redis.on("error",()=>{
    console.log("redis is disconnected 😣")
})

export default redis