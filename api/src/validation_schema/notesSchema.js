import {z} from "zod"

export const notesSchema = z.object({
    title: z.string().min(1),
    body: z.string().min(1),
    releaseAt: z.string().refine(val => !isNaN(Date.parse(val)), {message : "Invalid Date !!!"}),
    webhookUrl: z.string().url()
}) 