import mongoose, { Mongoose } from "mongoose"

const Attempts = new mongoose.Schema({
    at: { type: Date, required: true },
    statusCode: { type: Number, required: true },
    ok: { type: Boolean, required: true },
    error: { type: String },
}, { _id: false })

const NoteSchema = new mongoose.Schema({
    title: { type: String, required: true },
    status: { type: String, enum: ["pending", "delivered", "failed", "dead"], required: true, default: "pending" },
    body: { type: String, required: true },
    releaseAt: {type: Date, required : true},
    webhookUrl: { type: String, required: true },
    attempts: {type: [Attempts], default: []},
    deliveredAt: {type: Date, default: null},
}, {timestamps: true})

NoteSchema.index({releaseAt : 1})
NoteSchema.index({status : 1})

const Note = mongoose.model("Note", NoteSchema)

export default Note;