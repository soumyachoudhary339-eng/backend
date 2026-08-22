import mongoose from "mongoose"
import dotenv from "dotenv"
dotenv.config()
export const dbconnect = async()=>{
    try {
       await mongoose.connect(process.env.DB_URL) 
       console.log("db is connected 😊")
    } catch (error) {
        console.log("db error 😑",error)
    }
}