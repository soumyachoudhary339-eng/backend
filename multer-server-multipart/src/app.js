require("dotenv").config();
const express = require('express')
const postRouter = require("./routes/post.route");
const app = express()
app.use(express.json())
app.use("/api/post", postRouter)

module.exports = app