const mongoose = require("mongoose")
require("dotenv").config()

const dbconnect = async () => {
    try {
        await mongoose.connect(process.env.db_url)
        console.log("db is connected 😊")
    } catch (error) {
        console.log("db not connect 😑", error)
    }
}

module.exports = dbconnect