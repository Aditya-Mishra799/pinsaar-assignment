import express from "express"
import { createNote, listNotes, replayNote } from "../controllers/notesController.js"

const router = express.Router()
router.post("/", createNote)
router.get("/", listNotes)
router.post("/:id/replay", replayNote)

export default router