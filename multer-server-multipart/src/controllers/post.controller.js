const sendfile = require("../config/imagekit");

const getpost = async (req, res) => {
    try {
        const files = req.files;
        const uploadfiles = await Promise.all(files.map(async (elem) => {
            return await sendfile(elem.buffer, elem.originalname)
        }))
        console.log("uploadfiles->",uploadfiles)
         return res.status(200).json({
            success: true,
            message: "Files uploaded successfully",
            data: uploadfiles
        });
    } catch (error) {
        console.log(error)
        return res.status(500).json({
            success: false,
            message: "Someting went wrong",
            error
        })
    }
}

module.exports = { getpost }