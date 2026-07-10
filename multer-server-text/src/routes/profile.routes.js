const express = require("express")
const upload = require("../config/multer")
const { getProfileController } = require("../controllers/profile.controller")
const router = express.Router()

router.post("/", upload.single("image",), getProfileController)

module.exports = router