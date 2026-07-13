const express = require("express")
const upload = require("../config/multer")
const { getpost } = require("../controllers/post.controller")

const router = express.Router()

router.post("/", upload.array("images", 5), getpost)


module.exports = router