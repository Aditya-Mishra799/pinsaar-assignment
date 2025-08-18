import Note from "./models/Note.js";
import crypto from "crypto"
import axios from "axios"

const getIdempotencyKey = (noteId, time) => {
    return crypto.createHash("sha256").update(`${noteId}:${time.toISOString()}`).digest("hex")
}

export const deliverNotes = async (job) => {
    const note = await Note.findById(job.data.noteId)
    if (!note || !(note.status === "pending")) return;
    try {
        const res = await axios.post(note.webhookUrl, note, {
            headers: {
                "X-Note-Id": note._id,
                "X-Idempotency-Key": getIdempotencyKey(note._id, note.releaseAt),
            },
            timeout: 5000,
        })
        if (res.status !== 200) {
            throw new Error("Delivery failed");
        }
        note.attempts.push({
            at: new Date(),
            statusCode: res.status,
            ok: res.status === 200,
            error: res.status === 200 ? null : `${res.status} response`
        })
        if (res.data.duplicate === false) {
            note.status = "delivered";
            note.deliveredAt = new Date();
        }
        await note.save()
    } catch (error) {
        const statusCode = error?.response ? error?.response?.status : 500
        note.attempts.push({
            at: new Date(),
            statusCode: statusCode,
            ok: statusCode === 200,
            error: `${statusCode} response`
        })
        await note.save()
        throw error;
    }
}

export const handleFailedNotesDelivery = async (job, error) => {
    const { noteId } = job.data
    const note = await Note.findById(noteId)
    if (!note) return
    if (job.attemptsMade >= job.opts.attempts) {
        note.status = "dead"
        await note.save()
    }
}