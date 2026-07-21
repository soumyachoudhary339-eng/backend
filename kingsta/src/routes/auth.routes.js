import express from 'express';
import { loginController, registerController } from '../controllers/auth.controller.js';
import { upload } from '../config/multer.js';
const router = express.Router();

router.post('/register',upload.single("image"), registerController);
router.post('/login',loginController);


export default router;