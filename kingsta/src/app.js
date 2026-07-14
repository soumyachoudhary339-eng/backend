import express from "express";
import dotenv from "dotenv";
import cookieParser from "cookie-parser"
import { connectdb } from "./config/db.js";
import userRouter from './routes/auth.routes.js';
dotenv.config();
const app = express();
connectdb();
app.use(express.json());
app.use(cookieParser())
app.use("/api/kingsta",userRouter);


export default app;