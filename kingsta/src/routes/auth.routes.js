import express from 'express';
import { registerController } from '../controllers/auth.controller.js';
import { upload } from '../config/multer.js';
const router = express.Router();

router.post('/',upload.single("image"), registerController);

export default router;