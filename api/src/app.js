import express from "express"
import cors from "cors"
import notesRouter from "./routes/notes.js"
const app = express()
app.use(express.json())
app.use(cors())


app.use("/api/notes", notesRouter)
app.get("/health", (req, res) => {
    return res.json({ ok: true })
})

app.get("/", (req, res) => {
    return res.json("Server is  running...")
})

export default app