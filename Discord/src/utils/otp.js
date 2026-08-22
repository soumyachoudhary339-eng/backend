  
import crypto from "crypto"

const generateOtp=()=>{
 const otp = crypto.randomInt
        (1000, 10000).toString()
}

export default generateOtp