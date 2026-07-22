require("dotenv").config()
const express = require("express")
const productRouter= require("./src/routes/product.routes")
const connectdb = require("./src/config/db.js/db")
const app = express()
connectdb()
app.use(express.json())
app.use("/api/product",productRouter)
PORT=process.env.port||4000
app.listen(PORT,()=>{
    console.log(`server is running on ${PORT} 😁`)
})