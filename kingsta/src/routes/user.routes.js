import express from "express"
import { authMiddleware } from "../middlewares/auth.middleware.js"
import { followUser, getMe, getUserProfile, searchUser, unfollowUser } from "../controllers/user.controller.js"
import { updatePostController } from "../controllers/post.controller.js"
const router = express.Router() 

router.get("/getMe",authMiddleware,getMe)
router.patch("/update-profile",authMiddleware,updatePostController)

router.get("/search",authMiddleware,searchUser)
router.patch("/follow/:id",authMiddleware,followUser)
router.patch("/unfollow/:id",authMiddleware,unfollowUser)
router.get("/:username",authMiddleware,getUserProfile)

export default router