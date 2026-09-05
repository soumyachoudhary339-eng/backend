import serverModel from "../models/server.model.js"
import userModel from "../models/user.model.js"
import { sendfile } from "../services/storage.service.js"
import { generateInviteCode } from "../utils/invitecode.js"

export const createServer = async (req, res) => {
    try {
        const { name, description, isPublic } = req.body
        const icon = req.files.icon
        const banner = req.files.banner
        let uploadIcon = null
        if (icon) {
            uploadIcon = await sendfile(icon[0].buffer, icon[0].originalname)
        }
        let uploadBanner = null
        if (banner) {
            uploadBanner = await sendfile(banner[0].buffer, banner[0].originalname)
        }
        const inviteCode = generateInviteCode()
        const server = await serverModel.create({
            name,
            description,
            owner: req.user.id,
            icon: uploadIcon.url || "",
            banner: uploadBanner.url || "",
            isPublic,
            inviteCode
        })
        return res.status(201).json({
            success: true,
            message: "server created successfully"
        })
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: "internal server error",
            error
        })
    }
}

export const joinServer = async (req, res) => {
    try {
        const { inviteCode } = req.params
        const server = await serverModel.findOne({ inviteCode })
        if (!server) {
            return res.status(404).json({
                success: false,
                message: "invalid invite code"
            })
        }
        const user = await userModel.findById(req.user.id)
        const alreadyExist = user.server.some((serverId) => {
            user.server.serverId.toString() === server._id.toString()
        })
        if (alreadyExist) {
            return res.status(400).json({
                success: false,
                message: "you are already a member of this server"
            })
        }
        user.server.push(server._id)
        await user.save()
        return res.status(200).json({
            success: true,
            message: "server joined successfully"
        })
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: "internal server error",
            error
        })
    }
}

export const getAllServer = async (req, res) => {
    try {
        const servers = await userModel.find()
        return res.status(200).json({
            success: true,
            message: "fetched all servers",
            servers
        })
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: "internal server error",
            error
        })
    }
}

export const getServerDetails = async (req, res) => {
    try {
        const { serverId } = req.params
        const serverDetails = await serverModel.findById(serverId)
        if (!serverDetails) {
            return res.status(404).json({
                success: false,
                message: "Server not found"
            });
        }
        return res.status(200).json({
            success: true,
            message: "Server details fetched successfully",
            data: serverDetails
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: "internal server error",
            error
        })
    }
}

export const updateServerDetails = async (req, res) => {
    try {
        const { serverId } = req.params
        const { name, description, isPublic } = req.body
        const icon = req.files?.icon
        const banner = req.files?.banner

        const server = await serverModel.findById(serverId);
        if (!server) {
            return res.status(404).json({
                success: false,
                message: "Server not found"
            });
        }
        // Only owner can update server details 
        if (server.owner.toString() !== req.user._id.toString()) {
            return res.status(403).json({
                success: false,
                message: "Only server owner can update server details"
            });
        }

        const updateServer = {}
        if (name) updateServer.name = name
        if (description) updateServer.description = description
        if (isPublic) updateServer.isPublic = isPublic
        if (icon?.length) {
            const uploadIcon = await sendfile(icon[0].buffer, icon[0].originalname)
            updateServer.icon = uploadIcon.url
        }
        if (banner?.length) {
            const uploadBanner = await sendfile(banner[0].buffer, banner[0].originalname)
            updateServer.icon = uploadBanner.url
        }
        const updateServerDetails = await serverModel.findByIdAndUpdate(
            serverId,
            { $set: updateServer },
            { new: true, runValidators: true })
        if (!updateServerDetails) {
            return res.status(404).json({
                success: false,
                message: "Server not found"
            });
        }
        return res.status(200).json({
            success: true,
            message: "Server details updated successfully",
            data: updateServerDetails
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: "internal server error",
            error
        })
    }
}

export const deleteServer = async (req, res) => {
    try {
        const { serverId } = req.params
        const server = await serverModel.findById(serverId);
        if (!server) {
            return res.status(404).json({
                success: false,
                message: "Server not found"
            });
        }
         if (server.owner.toString() !== req.user._id.toString()) {
            return res.status(403).json({
                success: false,
                message: "Only server owner can update server details"
            });
        }
        const serverdelete = await serverModel.findByIdAndDelete(serverId)
        if (!server) {
            return res.status(404).json({
                success: false,
                message: "Server not found"
            });
        }
        return res.status(200).json({
            success: true,
            message: " deleted successfully",
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: "internal server error",
            error
        })
    }
}