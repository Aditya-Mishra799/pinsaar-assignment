import dotenv from "dotenv"
import mongoose from "mongoose"
import { Queue, Worker } from "bullmq"
import Note from "./models/Note.js"
import { deliverNotes, handleFailedNotesDelivery } from "./deliveryWorker.js"
import { connectToDataBase } from "./config/db.js"

dotenv.config();
const POLL_INTERVAL = process.env.POLL_INTERVAL || 5000
connectToDataBase(process.env.MONGO_URI)
const connection = {
    host: process.env.HOST || '127.0.0.1',
    port: process.env.PORT || 6379,
    maxRetriesPerRequest: null,
};

const noteQueue = new Queue("note-delivery", { connection })

const pollAndEnqueue = async () => {
    const now = new Date()
    const pendingNotes = await Note.find({ status: "pending", releaseAt: { $lte: now } })
    for (const note of pendingNotes) {
        await noteQueue.remove(`${note._id}:${note.releaseAt.toISOString()}`)
        await noteQueue.add("deliver", { noteId: note._id }, {
            jobId: `${note._id}:${note.releaseAt.toISOString()}`, attempts: 3,
            backoff: {
                type: "exponential",
                delay: 1000
            }
        })
    }
}
setInterval(pollAndEnqueue, POLL_INTERVAL)

const worker = new Worker("note-delivery", deliverNotes, { connection })

worker.on("completed", job => {
  console.log(`Job ${job.id} completed`)
})
worker.on("active", (job) => {
  console.log(`Job ${job.id} started`)
})
worker.on("failed", handleFailedNotesDelivery)
