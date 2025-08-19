import dotenv from "dotenv"
dotenv.config()

const ADMIN_TOKEN = process.env.ADMIN_TOKEN

export const requireAuth = (req, res, next)=>{
    const header = req.headers.authorization
    if(!header || !header.startsWith("Bearer ")){
        return res.status(401).json({ error: "Missing or invalid Authorization header" });
    }
    const token = header.slice(7)
    if(token !== ADMIN_TOKEN){
        return res.status(403).json({ error: "Invalid admin token" });
    }
    next();
}