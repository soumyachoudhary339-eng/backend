import userModel from "../models/user.model"
import { sendfile } from "../services/storage.service"
import { genrateToken } from "../utils/token"
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
                success:true,
                message:"User register successfully"
            })
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: "internal server error",
            error
        })
    }
}