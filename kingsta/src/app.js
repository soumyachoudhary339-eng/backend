import express from "express";
import dotenv from "dotenv";
import cookieParser from "cookie-parser"
import { connectdb } from "./config/db.js";
import authRouter from './routes/auth.routes.js';
import postRouter from "./routes/post.routes.js"
import userRouter from "./routes/user.routes.js"
dotenv.config();
const app = express();
connectdb();
app.use(express.json());
app.use(cookieParser())
app.use("/api/kingsta",authRouter);
app.use("/api/post",postRouter);
app.use("/api/user",userRouter)


export default app;