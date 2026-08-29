import express from "express"
import { getme, updatePassword, updateUserProfile, userProfile } from "../controllers/user.controller.js"
import { authMiddleware } from "../middlewares/auth.middleware.js"
const router = express.Router()

router.get("/getme",getme)
router.get("/userprofile",userProfile)
router.get("/updateprofile",authMiddleware,updateUserProfile)
router.get("/updatepassword",authMiddleware,updatePassword)

export default router