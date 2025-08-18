import Redis from "ioredis"

export const connectToRedis = (redisURL) =>{
    const redis = new Redis(redisURL)
    redis.on("connect", ()=>console.log("Connected to Redis ✅..."))
    redis.on("error", (error)=>console.log("Redis Error :", error))
    return redis
}