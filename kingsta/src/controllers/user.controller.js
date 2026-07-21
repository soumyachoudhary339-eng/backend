import userModel from "../models/user.model.js";

export const getMe = async (req, res) => {
    try {
        const user = await userModel.findById(req.user.id).select("-password")
        if (!user) return res.status(404).json({
            success: false,
            message: "user ont found"
        })

        return res.status(200).json({
            success: true,
            message: "user found successfully",
            data: user
        })
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: "Inernal server error",
        });
    }
}


export const updateProfile = async (req, res) => {
    try {
        const { username, fullname, mobile, dob, bio } = req.body

        const updateData = {}
        if (username) updateData.username = username
        if (fullname) updateData.fullname = fullname
        if (mobile) updateData.mobile = mobile
        if (dob) updateData.dob = dob
        if (bio) updateData.bio = bio

        const updateUser = await userModel.findByIdAndUpdate(req.user.id, updateData, {
            new: true
        })

        if (!updateUser) return res.status(404).json({
            success: false,
            message: "user not found"
        })

        return res.status(200).json({
            success: true,
            message: "user profile updated successfully",
            updateUser
        })
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: "Internal server error",
        });
    }
}

export const getUserProfile = async (req, res) => {
    try {
        const { username } = req.params

        const user = await userModel.findOne({ username }).select("-password")
        if (!user) return res.status(404).json({
            success: false,
            message: "user not found"
        })
        return res.status(200).json({
            success: true,
            message: "user found successfully",
            user
        })
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: "Inernal server error",
        });
    }
}

export const searchUser = async (req, res) => {
    try {
        const { query } = req.params
        if (!query) return res.status(400).json({
            success: false,
            message: "search query required"
        })
        const user = await userModel.find({
            $or: [
                { username: { $regex: query, $options: "i" } },
                { fullname: { $regex: query, $options: "i" } }
            ]
        }).select("username fullname profile_pic")

        if (user.length == 0) return res.status(404).json({
            success: false,
            message: "user not found"
        })

        return res.status(200).json({
            success: true,
            message: "user fetched successfully",
            user
        })
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: "Inernal server error",
        });
    }
}

export const followUser = async (req, res) => {
    try {
        const targetedId = req.params.id

        if (targetedId === req.user.id) return res.status(400).json({
            success: false,
            message: "you cannot follow yourself"
        })

        const loggedInUser = await userModel.findById(req.user.id)
        const targetUser = await userModel.findById(targetedId)

        if (!targetUser) return res.status(404).json({
            success: false,
            message: "user not found"
        })

        const alreadyExist = loggedInUser.followings.includes(targetedId)
        if (alreadyExist) return res.status(400).json({
            success: false,
            message: "you already follow this user"
        })

        loggedInUser.followings.push(targetedId)
        targetUser.followers.push(req.user.id)

        await Promise.all([
            loggedInUser.save(),
            targetUser.save()
        ]);

        return res.status(200).json({
            success:true,
            message:"User followed successfully"
        })

    } catch (error) {
        return res.status(500).json({
            success: false,
            message: "Inernal server error",
        });
    }
}

export const unfollowUser = async (req, res) => {
    try {
        const targetedId = req.params.id

        if (targetedId === req.user.id) return res.status(400).json({
            success: false,
            message: "you cannot unfollow yourself"
        })

        const loggedInUser = await userModel.findById(req.user.id)
        const targetUser = await userModel.findById(targetedId)

        if (!targetUser) return res.status(404).json({
            success: false,
            message: "user not found"
        })

        const alreadyExist = loggedInUser.followings.includes(targetedId)
        if (!alreadyExist) return res.status(400).json({
            success: false,
            message: "you already follow this user"
        })

        loggedInUser.followings.pull(targetedId)
        targetUser.followers.pull(req.user.id)
        await Promise.all([
            loggedInUser.save(),
            targetUser.save()
        ]);
        return res.status(200).json({
            success:true,
            message:"User unfollowed successfully"
        })
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: "Inernal server error",
        });
    }
}