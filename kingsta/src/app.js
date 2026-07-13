import express from "express";
import dotenv from "dotenv";
import { connectdb } from "./config/db.js";
import userRouter from './routes/user.routes.js';
dotenv.config();
const app = express();
connectdb();
app.use(express.json());
app.use("/api/kingsta",userRouter);


export default app;