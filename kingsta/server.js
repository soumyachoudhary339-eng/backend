import app from "./src/app.js";
import dotenv from "dotenv"
dotenv.config()
const PORT = process.env.port || 4000
app.listen(PORT, () => {
    console.log(`server is running on ${PORT} 😁`)
})