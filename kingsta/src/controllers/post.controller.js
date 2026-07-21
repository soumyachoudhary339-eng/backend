import postModel from "../models/post.model.js"
import { sendfile } from "../services/storage.service.js"

export const createPostController = async (req, res) => {
    try {
        let { caption, location } = req.body
        let files = req.files

        if (!files) return res.status(400).json({
            success: false,
            message: "Media is required"
        })
        let uploadImage = await Promise.all(
            files.map(async (elem) => {
                return await sendfile(elem.buffer, elem.originalname)
            })
        )
        let newPost = await postModel.create({
            caption,
            location,
            media_urls: uploadImage.map((elem) => elem.url)
        })
        return res.status(201).json({
            success: true,
            message: "Post created successfully",
            data, newPost
        })
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: "internal server error",
            error
        })
    }
}

export const getAllPostController = async (req, res) => {
    try {
        let allPost = await postModel.find()
        return res.status(200).json({
            success: true,
            message: "All post fetched",
            data: allPost
        })
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: "internal server error",
            error
        })
    }
}

export const updatePostController = async(req,res)=>{
    try {
        let post_id =req.params.post_id
        if(!req.body) return res.status(400).json({
        success: false,
        message: "Fields are required",
      });
      let updatePost = await postModel.findByIdAndUpdate(
        post_id,
        {
            $set:req.body
        },
        {
            new:true
        }
      )
      return res.status(200).json({
        success:true,
        message:"post updated",
        data:updatePost
      })
    } catch (error) {
         return res.status(500).json({
            success: false,
            message: "internal server error",
            error
        })
    }
}