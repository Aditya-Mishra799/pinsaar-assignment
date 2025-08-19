import express from "express"
import Redis from "ioredis"
import dotenv from "dotenv"
import { connectToRedis } from "./config/redis.js"

dotenv.config()

const app = express()
app.use(express.json())

const PORT = process.env.PORT || 4000
const redis = connectToRedis(process.env.REDIS_URL)
app.post("/sink", async (req, res) => {
    try {
        const key = req.get("X-Idempotency-Key")
        if (!key) {
            return res.status(400).json({ error: "Missing X-Idempotency-Key" });
        }
        const isNewNote = await redis.setnx(key, 1)
        if (isNewNote) {
            await redis.expire(key, 60 * 60 * 24)
            console.log("[SINK] Received new note:", req.body,);
            return res.status(200).json({ received: true, duplicate: false });
        }
        else {
            return res.status(200).json({ received: true, duplicate: true });
        }
    } catch (error) {
        return res.status(500).json({ error: "Internal Server Error", received: true });
    }
})

app.listen(PORT, () => console.log(`[SINK] Webhook sink listening on port ${PORT}`))