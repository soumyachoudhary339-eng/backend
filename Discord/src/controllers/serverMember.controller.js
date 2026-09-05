import { populate } from "dotenv"
import serverModel from "../models/server.model.js"
import serverMemberModel from "../models/serverMember.model"

export const getServerMember = async(req,res)=>{
    try {
        const {serverid} = req.params
        const serverExist = await serverModel.findById({serverid})
        if(!serverExist){
            return res.status(404).json({
                success:false,
                message:"server is not found"
            })
            const serverMemberDetail = await serverMemberModel.findOne({server:serverid}).populate({path:"users",select:
                "username fullname mobile_no",populate:{path:"roles",select:""} }) 

            return res.status(200).json({
                success:true,
                message:"all user detail fatched"
                
            })
        }
    } catch (error) {
         return res.status(500).json({
            success: false,
            message: "internal server error",
            error
        })
    }
}