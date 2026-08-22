import ImageKit from "imagekit";
import dotenv from "dotenv"
dotenv.config()
const storageInstance = new ImageKit({
    privateKey:process.env.IK_PRI_KEY,
    publicKey:process.env.IK_PUB_KEY,
    urlEndpoint:process.env.IK_URL,
})

export const sendfile = async(file,fileName)=>{
    const obj={
        file,
        fileName,
        folder:"min-project"
    }
    return await storageInstance.upload(obj)
}