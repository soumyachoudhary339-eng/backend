const app = require("./src/app/app");
require("dotenv").config()
PORT = process.env.port || 4000
app.listen(PORT, () => {
    console.log(`server is running on ${PORT} 😁`)
})