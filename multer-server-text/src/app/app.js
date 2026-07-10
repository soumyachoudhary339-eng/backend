const express = require("express")
const cors = require("cors")
const dbconnect = require("../config/db")
const profileRouter = require("../routes/profile.routes")
const app = express()
dbconnect()
app.use(cors({
    origin: "http://localhost:5174"
}))
app.use(express.json())
app.use("/api/profile", profileRouter)

module.exports = app