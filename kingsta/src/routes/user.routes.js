import express from "express"
import { authMiddleware } from "../middlewares/auth.middleware.js"
import { followUser, getMe, getUserProfile, searchUser, unfollowUser, updateProfile } from "../controllers/user.controller.js"
import { upload } from "../config/multer.js"
const router = express.Router() 

router.get("/getme",authMiddleware,getMe)
router.patch("/update-profile",authMiddleware,upload.single("image"),updateProfile)

router.get("/search",authMiddleware,searchUser)
router.patch("/follow/:id",authMiddleware,followUser)
router.patch("/unfollow/:id",authMiddleware,unfollowUser)
router.get("/:username",authMiddleware,getUserProfile)

export default router