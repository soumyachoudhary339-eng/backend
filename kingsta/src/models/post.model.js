import mongoose from "mongoose";

const postSchema = new mongoose.Schema({
    media_urls:{
        type:String,
        required:true
    },
    caption:{
        type:String
    },
    likes:{
        type:mongoose.Schema.ObjectId,
        ref:"users"
    },
    comments:[{
        type:mongoose.Schema.ObjectId,
        ref:comments
    }],
    location:{
        type:String
    },
},
{
    timestamps:true
}
)

const postModel= mongoose.model("post",postSchema)
export default postModel