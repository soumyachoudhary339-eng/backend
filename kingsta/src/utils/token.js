import dotenv from "dotenv"
dotenv.config()
import jwt from "jsonwebtoken"

export const genrateToken=(id,time)=>{
    return jwt.sign({id},process.env.SecretKey,{
        expiresIn:time
    })
}