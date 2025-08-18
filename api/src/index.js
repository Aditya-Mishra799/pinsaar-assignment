import dotenv from "dotenv"
import app from "./app.js"
import { connectToDataBase } from "./config/db.js"
import { connectToRedis } from "./config/redis.js"
dotenv.config();

const PORT = process.env.PORT || 3000;
const MONGO_URI = process.env.MONGO_URI;
const REDIS_URL = process.env.REDIS_URL;
const HOST = process.env.HOST;
connectToDataBase(MONGO_URI)
connectToRedis(REDIS_URL)
app.listen(PORT,HOST, ()=>console.log(`API server is running on ${PORT} ✅ `))