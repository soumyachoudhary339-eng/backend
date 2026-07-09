const sendFile = require("../config/imagekit")

const getImageController = async (req, res) => {
    try {
        console.log(req.file)
        const file = req.file
        if (!file) {
            return res.status(404).json({
                success: false,
                message: "Please select a file"
            })
        }

        const uploadFile = await sendFile(file.buffer, file.originalname)
        console.log(uploadFile)
        return res.status(200).json({
            success: true,
            message: "file uploaded",
            uploadFile
        })

    } catch (error) {
        return res.status(500).json({
            success: false,
            message: "Something went wrong"
        })
    }
}

module.exports = { getImageController }