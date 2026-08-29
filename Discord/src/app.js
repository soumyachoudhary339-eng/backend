import express from "express"
import { dbconnect } from "./config/db.js"
import cookieParser from "cookie-parser"
import authRouter from "./routes/auth.route.js"
import userRouter from "./routes/auth.route.js"
import redis  from "./config/redis.js"

import passport from "./config/passport.js"
const app = express()
dbconnect()
app.use(passport.initialize());
app.use(cookieParser())
app.use(express.json())
app.use("/api/auth",authRouter)
app.use("/api/user",userRouter)
app.use(ApiErrorHandler)


export default app