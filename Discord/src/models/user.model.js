import mongoose from "mongoose";
import bcrypt from "bcrypt"

const userSchema = new mongoose.Schema({
    username: {
        type: String,
        required: true,
        unique: true,
        trim: true,
        minlength: 3,
        maxlength: 20,
    },
    fullname: {
        type: String,
        required: true,
        minlength: 2,
        maxlength: 50,
    },
    email: {
        type: String,
        required: true
    },
    password: {
        type: String,
        minlength: 6,
        select: false
    },
    mobile_no: {
        type: Number,
        unique: true,
        sparse: true,
        trim: true,
        minlength: 10,
        maxlength: 10
    },
    profile_pic: {
        type: String,
        default: ""
    },
    googleId: {
        type: String,
        unique: true
    },
    authProvider: {
        type: String,
        enum:["local", "google"],
        default: "local"
    },
    server: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: "servers"
    }],
    friend: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: "friends"
    }],
},
    {
        timestamps: true
    })

userSchema.pre("save", function () {
    if (!this.password ||!this.password.isModified("password")) {
        return 
    }
        return this.password = hashSync(password, 10)
         
})

userSchema.methods.comparePass = function (password) {
    return bcrypt.compareSync(password, this.password)
}

const userModel = mongoose.model("users", userSchema)

export default userModel