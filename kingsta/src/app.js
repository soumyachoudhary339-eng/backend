import express from "express";
import dotenv from "dotenv";
import cookieParser from "cookie-parser"
import { connectdb } from "./config/db.js";
import cors from "cors";
import authRouter from './routes/auth.routes.js';
import postRouter from "./routes/post.routes.js"
import userRouter from "./routes/user.routes.js"
import passport from "./config/passport.js";

import morgan from "morgan"
dotenv.config();
const app = express();
connectdb();
app.use(morgan('dev'));
app.use(passport.initialize());
app.use(cors({
    origin: "http://localhost:5173",
    credentials: true
}));
app.use(express.json());
app.use(cookieParser())
app.use("/api/kingsta", authRouter);
app.use("/api/kingsta/post", postRouter);
app.use("/api/kingsta/user", userRouter)


export default app;