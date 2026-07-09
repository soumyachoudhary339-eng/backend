const { default: mongoose } = require("mongoose")
require("dotenv").config()
const connectdb =async()=>{
    try {
        await mongoose.connect(process.env.db_URL)
        console.log("db is connected")
    } catch (error) {
        console.log("db not connect",error)
    }
}
module.exports = connectdb