import dotenv from "dotenv"
dotenv.config()
import mongoose from "mongoose";

export const dbconnect = async()=>{
    try {
        await mongoose.connect(process.env.DB_URL)
        console.log("db is connected 😁")
    } catch (error) {
        console.log("db don't connect 😑")
    }
}