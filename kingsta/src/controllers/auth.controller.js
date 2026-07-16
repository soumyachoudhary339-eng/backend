import userModel from "../models/user.model.js"
import { sendfile } from "../services/storage.service.js"
import { genrateToken } from "../utils/token.js"
export const registerController = async (req, res) => {
    try {
        const {
            username,
            fullname,
            email,
            mobile,
            password } = req.body
        const file = req.file
        if (!username || !fullname || !email || !mobile || !password) {
            return res.status(400).json({
                success: false,
                message: "all field are required"
            })
        }
        const uploadfile = await sendfile(file.buffer, file.originalname)

        const newUser = await userModel.create({
            username,
            fullname,
            email,
            mobile,
            password,
            profile_pic: uploadfile.url
        })
        const accessToken = genrateToken({ id: newUser._id }, "15min")
        const refreshToken = genrateToken({ id: newUser._id }, "1d")
        res.cookie("accessToken",
            accessToken,
            {
                httpOnly: true,
                expire: 15 * 60 * 1000
            })
        res.cookie("refreshToken",
            refreshToken,
            {
                httpOnly: true,
                expire: 24 * 60 * 60 * 1000
            })

        return res.status(201).json({
            success: true,
            message: "User register successfully",
            newUser
        })
    } catch (error) {
        console.log(error)
        return res.status(500).json({
            success: false,
            message: "internal server error",
            error
        })
    }
}
export const loginController = async (req, res) => {
    try {
        const {
            email,
            password } = req.body
        const file = req.file
        if (!email || !password) {
            return res.status(400).json({
                success: false,
                message: "all field are required"
            })
        }


        const isExisted = await userModel.findOne({ email }).select("-password")
        if (!isExisted) {
            return res.status(404).json({
                success: false,
                message: "user not found"
            })
        }
        const checkpass = isExisted.comparePass(password)
        if (!checkpass) {
            return res.status(401).json({
                success: false,
                message: "invalid credentials"
            })
        }
        const accessToken = genrateToken({ id: isExisted._id }, "15min")
        const refreshToken = genrateToken({ id: isExisted._id }, "1d")
        res.cookie("accessToken",
            accessToken,
            {
                httpOnly: true,
                expire: 15 * 60 * 1000
            })
        res.cookie("refreshToken",
            refreshToken,
            {
                httpOnly: true,
                expire: 24 * 60 * 60 * 1000
            })

        return res.status(200).json({
            success: true,
            message: "User loggedin successfully",
            newUser
        })
    } catch (error) {
        console.log(error)
        return res.status(500).json({
            success: false,
            message: "internal server error",
            error
        })
    }
}