const mongoose = require("mongoose")
const Schema = mongoose.Schema

const profileSchema = new Schema({
    name: String,
    email: {
        type: String,
        required: true
    },
    password: {
        type: String,
        required: true
    },
    image: {
        type: String,
        required: true
    }
},
    { timestamps: true }
)

const profileModel = mongoose.model("profile", profileSchema)
module.exports = profileModel
