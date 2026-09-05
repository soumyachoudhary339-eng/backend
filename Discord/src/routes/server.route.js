import express from "express"
import { createServer, deleteServer, getAllServer, getServerDetails, joinServer, updateServerDetails } from "../controllers/server.controller.js"
import { authMiddleware } from "../middlewares/auth.middleware.js"
import { upload } from "../config/multer.js"
const router = express.Router()

router.post("/create",authMiddleware,upload.fields([
    {name:"icon",maxCount:1},
    {name:"banner",maxCount:1}
]), createServer)

router.post("/join/:inviteCode",authMiddleware,joinServer)

router.get("/getall",authMiddleware,getAllServer)

router.get("/getdetail/:serverId",authMiddleware,getServerDetails )

router.patch("/updatedetail/:serverId",authMiddleware,upload.fields([
    {name:icon,maxCount:1},{name:banner,maxCount:1}
]),updateServerDetails )

router.delete("/delete",authMiddleware,deleteServer)

export default router