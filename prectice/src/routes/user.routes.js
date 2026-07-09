const express = require("express");
const { userRegister, userLogin, registeredUser } = require("../controllers/user.controller");
const router = express.Router();

router.post("/register",userRegister)
router.post("/login",userLogin)
router.get("/",registeredUser)
module.exports = router