console.log("MY SERVER STARTED");
const app = require("./src/app");
require("dotenv").config()
const PORT=process.env.port||4000
app.listen(PORT,()=>{
    console.log(`server is running on ${PORT} 😁`)
})