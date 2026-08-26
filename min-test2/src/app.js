import express from "express"
import { dbconnect } from "./config/db.js"
import cookieParser from "cookie-parser"
import redis from "./config/redis.js"
dbconnect()
const app = express()
app.use(cookieParser())
app.use(express.json())


export default app