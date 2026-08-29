import userModel from "../models/user.model.js"

export const getme = async (req, res) => {
    try {
        const user = await userModel.findById(req.user.id).select("-password")
        if (!user) return res.status(404).json({
            success: false,
            message: "user not found"
        })
        return res.status(200).json({
            success: true,
            message: "user is successfully fatched",
            user
        })

    } catch (error) {
        return res.status(500).json({
            success: false,
            message: "internal server error",
            error
        })
    }
}

export const userProfile = async (req, res) => {
    try {
        const { username } = req.body
        if (!username) return res.startus(400).json({
            success: false,
            message: "username is requried"
        })
        const user = await userModel.findOne({ username }).select("-password")
        if (!user) return res.startus(404).json({
            success: false,
            message: "user not found"
        })
        res.status(200).json({
            success: true,
            message: "user found successfully"
        })
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: "internal server error",
            error
        })
    }
}

export const updateUserProfile = async (req, res) => {
    try {
        const { username, fullname, mobile_no } = req.body
        const updateUser = {}
        if (username) updateUser.username = username
        if (fullname) updateUser.fullname = fullname
        if (mobile_no) updateUser.mobile_no = mobile_no

        const user = await userModel.findByIdAndUpdate(req.user.id ,updateUser,{new:true})
        if(!user) return res.status(404).json({
            success:false,
            message:"usernot found"
        })
        return res.status(200).json({
            success:true,
            message:"user detail updated successfully"
        })

    } catch (error) {
        return res.status(500).json({
            success: false,
            message: "internal server error",
            error
        })
    }
}

export const updatePassword = async(req,res)=>{
    try {
        const {newpassword}=req.body
        if(!newpassword) return res.status(400).json({
            success:fales,
            message:"new password is required"
        })
        const user = await userModel.findById(req.user.id)
        if(!user) return req.status(404).json({
            success:false,
            message:"user not found"
        })
        user.password=newpassword
        await user.save()
        return res.status(200).json({
            success:true,
            message:"password is successfully changed"
        })
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: "internal server error",
            error
        })
    }
}