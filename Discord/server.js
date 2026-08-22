import app from "./src/app.js"
import dotenv from "dotenv"
dotenv.config()
const Port=process.env.PORT ||4000
app.listen(Port,()=>{
    console.log(`server is running on ${Port} 😁`)
})