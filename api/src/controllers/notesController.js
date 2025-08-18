import { notesSchema } from "../validation_schema/notesSchema.js";
import Note from "../models/Note.js";
import mongoose, { Mongoose } from "mongoose";
const itemsPerPage = 20
export const createNote = async (req, res) =>{
    try {
        const noteData = req.body
        const isvalid = notesSchema.safeParse(noteData)
        if(!isvalid.success){
            return res.status(400).json({error: "Invalid Data !!!", details : isvalid.error} )
        }
        const {title, body, releaseAt, webhookUrl} = req.body
        const newNote = await Note.create({
            title,
            body,
            releaseAt: new Date(releaseAt),
            webhookUrl,
        })
        return res.status(201).json({id: newNote._id})
    } catch (error) {
        return res.status(501).json({error :"Internal Server Error", details : error.message} )
    }
}

export const listNotes = async (req, res)=>{
    try {
        const {status, page = 1} = req.query;
        const query = status ? {status} : {}
        const notes = await Note.find(query).sort({releaseAt : 1}).skip((page - 1)*itemsPerPage).limit(itemsPerPage)
        return res.json(notes)
    } catch (error) {
        return res.status(500).json({error: "Internal Server Error", details: error.message})
    }
}
export const replayNote = async (req, res) =>{
    try {
        const {id} = req.params
        const validStatus = ["failed", "dead"]
        if(!mongoose.isValidObjectId(id)){
            return res.status(400).json({error: "Invalid note ID !!!", details: "ID must be a valid mongo db id"})
        }
        const note = await Note.findById(id)
        if(!note){
            return res.status(404).json({error: "Note not found", details: "Please ensure that ID is correct"})
        }
        if(!validStatus.includes(note.status)){
            return res.status(400).json({error: "Can only replay dead or failed notes", details: `the note is of status ${note.status}`})
        }
        note.status = "pending"
        await note.save()
        return res.json({ message: "Note requeued successfully", data: note})
    } catch (error) {
        return res.status(500).json({error: "Internal Server error", details: error.message})
    }
}