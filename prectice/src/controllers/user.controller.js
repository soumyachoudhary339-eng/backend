const userModel = require("../model/user.model")
const bcrypt = require("bcryptjs")
const jwt = require("jsonwebtoken")
const cookie = require("cookie-parser")
require("dotenv").config()
const userRegister = async (req, res) => {
    try {
        const { name, email, password } = req.body
        if (!name || !email || !password) {
            return res.status(400).json({
                success: false,
                message: "all fields are required"
            })
        }
        const hashpassword = bcrypt.hashSync(password, 10)


        const userCreate = await userModel.create({
            name, email, password: hashpassword
        })
        const token = jwt.sign({ id: userCreate._id },process.env.JWT_Secret , { expiresIn: "1d" })
        res.cookie("token", token)
        return res.status(201).json({
            success: true,
            message: "user created",
            data: userCreate
        })
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: "something went wrong",
            error,
        })
    }
}

const userLogin = async (req, res) => {
    try {
        const { email, password } = req.body
        if (!email || !password) {
            return res.status(400).json({
                success: false,
                message: "all fields are required"
            })
        }
        const user = await userModel.findOne({ email })
        if (!user) {
            return res.status(404).json({
                success: false,
                message: "user not registered"
            })
        }
        const match = await bcrypt.compare(password, user.password)
    
        if (!match) {
            return res.status(401).json({
                success: false,
                message: "plaese enter correct password"
            })
        }
        const token = jwt.sign({ id: user._id }, process.env.JWT_Secret , { expiresIn: "1d" })
        res.cookie("token", token)
        return res.status(200).json({
            success: true,
            message:"successfully login",
            password: match,
            user
        })
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: "something went wrong",
            error,
        })
    }
}

const registeredUser = async (req,res)=>{
    try {
        const alluser = await userModel.find()
        return res.status(200).json({
            success:true,
            message:"all register users",
            alluser
        })
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: "something went wrong",
            error,
        })
    }
}

module.exports = { userRegister, userLogin ,registeredUser}