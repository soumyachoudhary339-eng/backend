import serverModel from "../models/server.model.js"
import userModel from "../models/user.model.js"
import { sendfile } from "../services/storage.service.js"
import { generateInviteCode } from "../utils/invitecode.js"

export const createServer = async(req,res)=>{
    try {
        const {name,description,isPublic}=req.body
        const icon = req.files.icon
        const banner=req.files.banner
        let uploadIcon=null
        if(icon){
            uploadIcon= await sendfile(icon[0].buffer,icon[0].originalname)
        }
        let uploadBanner=null
        if(banner){
            uploadBanner= await sendfile(banner[0].buffer,banner[0].originalname)
        }
        const inviteCode = generateInviteCode()
        const server = await serverModel.create({
            name,
            description,
            owner:req.user.id,
            icon:uploadIcon.url||"",
            banner:uploadBanner.url||"",
            isPublic,
            inviteCode
        })
        return res.status(201).json({
            success:true,
            message:"server created successfully"
        })
    } catch (error) {
         return res.status(500).json({
            success: false,
            message: "internal server error",
            error
        })
    }
}

export const joinServer=async (req,res)=>{
    try {
        const{inviteCode}=req.params
        const server = await serverModel.findOne({inviteCode})
        if(!server){
            return res.status(404).json({
                success:false,
                message:"invalid invite code"
            })
        }
        const user = await userModel.findById(req.user.id)
        const alreadyExist = user.server.some((serverId)=>{
            user.server.serverId.toString()===server._id.toString()
        })
        if(alreadyExist){
            return res.status(400).json({
                success:false,
                message:"you are already a member of this server"
            })
        }
        user.server.push(server._id)
        await user.save()
        return res.status(200).json({
            success:true,
            message:"server joined successfully"
        })
    } catch (error) {
         return res.status(500).json({
            success: false,
            message: "internal server error",
            error
        })
    }
}