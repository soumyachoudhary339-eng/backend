const express = require("express")
const UserRouter = require("./src/routes/user.routes")
const connectdb = require("./src/config/db")
require("dotenv").config()
const app = express()
app.use(express.json())
connectdb()

app.use("/api/user",UserRouter)

app.listen(process.env.PORT,()=>{
    console.log("server is running")
})