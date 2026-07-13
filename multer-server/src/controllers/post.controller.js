const sendFile = require("../config/imagekit")

const getImageController = async (req, res) => {
    try {
        console.log(req.file)
        const file = req.file

        console.log("file->", file)
        console.log("body->", req.body)
        const uploadFile = await sendFile(file.buffer, file.originalname)
        console.log(uploadFile)
        return res.status(200).json({
            success: true,
            message: "file uploaded",

        })

    } catch (error) {
        console.error(error);
        return res.status(500).json({
            success: false,
            message: "Something went wrong"
        })
    }
}

module.exports = { getImageController }