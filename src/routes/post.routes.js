const express = require("express");
const upload = require("../config/multer");
const router = express.Router();

router.post("/",upload.single('Image'),(req,res)=>{
    console.log(req.body);
    console.log(req.file);
    const file = req.file
    if(!file){
        return res.status(404).json({
            success:false,
            message:"Please select a file"
        })
    }
return res.status(200).json({
        success:true,
        message:"file uploaded",
    });

});

module.exports = router