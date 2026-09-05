import express from "express"
import { authMiddleware } from "../middlewares/auth.middleware.js"

const router =  express.Router()

router.get("/serverMember/:serverid",authMiddleware,)


export default router