import mongoose from "mongoose";
export const connectToDataBase = async(mongoUri) =>{
    try {
        await mongoose.connect(mongoUri);
        console.log("Mongo Data Base connected...")
    } catch (error) {
        console.log("Database connection Failed !!! :(", error)
        process.exit(1)
    }
}
