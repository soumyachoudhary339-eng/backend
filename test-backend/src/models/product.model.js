const mongoose = require("mongoose")

const productSchema = new mongoose.Schema({
    name:{
        type:String,
        required:true
    },
    title:{
        type:String,
        required:true
    },
    description:{
        type:String,
        required:true
    },
    price:{
        type:Number,
        required:true
    },
    stock:{
        type:String,

    },
    quality:{
        type:String,
    },
    category:{
        type:String,
    },
    image:{
        type:String,
    }
},
{
    timestamps:true
}
)

const productModel= mongoose.model("product",productSchema) 
module.exports=productModel