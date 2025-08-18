import express from "express"
import cors from "cors"
const app = express()
app.use(express.json())
app.use(cors())

app.get("/health", (req, res) => {
    return res.json({ ok: true })
})

app.get("/", (req, res) => {
    return res.json("Server is  running...")
})

export default app