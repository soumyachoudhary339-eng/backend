const ImageKit = require("imagekit")
require("dotenv").config()
const storeInstance = new ImageKit({
    privateKey: process.env.IMAGEKIT_PRI_KEY,
    publicKey: process.env.IMAGEKIT_PUB_KEY,
    urlEndpoint: process.env.IMAGEKIT_URL,
})

const sendfile = async (file, fileName) => {
    return await storeInstance.upload({ file, fileName })
}

module.exports = sendfile