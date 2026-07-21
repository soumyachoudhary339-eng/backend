import express from "express"
import { createPostController, getAllPostController, updatePostController } from "../controllers/post.controller"
import { authMiddleware } from "../middlewares/auth.middleware"
import { upload } from "../config/multer"
const router = express.Router()

router.post("/create",authMiddleware,upload.array("images",5),createPostController)
router.get("/",getAllPostController)
router.put("/update/:id",authMiddleware,updatePostController)


export default router