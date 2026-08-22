import express from 'express';
import { forgetpassword, googleAuth, loginController, logoutController, registerController, resetPassword } from '../controllers/auth.controller.js';
import { upload } from '../config/multer.js';
import passport from "../config/passport.js";
const router = express.Router();

router.post('/register',upload.single("image"), registerController);
router.post('/login',loginController);
router.post("/logout",logoutController)
router.post("/reset-password",resetPassword)
router.post("/forget-password",forgetpassword)
router.get('/auth/google',passport.authenticate('google', { scope: ['profile', 'email'], prompt: "select_account" }))
router.get('/auth/google/callback',passport.authenticate('google', {session: false,}),googleAuth)

export default router;