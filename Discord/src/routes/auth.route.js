import express from 'express'
import { upload } from '../config/multer.js'
import { googleUser, loginUser, registerUser, sendOtp, verifyOtp  } from '../controllers/auth.controller.js'
import passport from '../config/passport.js'
const router = express.Router()

router.post("/register", upload.single("image"), registerUser)
router.post("/login", loginUser)
router.get("/google", passport.authenticate("google", { scope: ["email", "profile"], prompt: "select_account" }))
router.get("/google/callback", passport.authenticate("google", { session: false }),googleUser)
router.post("/send-otp",sendOtp)
router.post("/verify-otp",verifyOtp)
export default router