const sendFile = require("../config/imagekit")
const profileModel = require("../model/profile.model")

getProfileController = async (req, res) => {
    try {
        // console.log(req.file)
        const file = req.file
        // console.log("file->", file)
        // console.log("body->", req.body)

        const uploadFile = await sendFile(file.buffer, file.originalname)

        console.log("uploadFile->", uploadFile)

        const { name, email, password } = req.body

        const profile = await profileModel.create({
            name,
            email,
            password,
            image: uploadFile.url
        })

        return res.status(200).json({
            success: true,
            message: "file uploaded",
            data: profile
        })
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: "something went wrong",
            error,
        })
    }
}

module.exports = { getProfileController }