import bcrypt from "bcrypt"
import userModel from "../models/user.model.js"
import { sendfile } from "../services/storage.service.js"
import { generateToken } from "../utils/token.js"
import sendEmail from "../services/email.service.js"
import redis from "../config/redis.js"
import generateOtp from "../utils/otp.js"

export const registerUser = async (req, res) => {
    try {
        const { username, fullname, email, password, mobile_no, } = req.body
        const file = req.file
        if (!fullname || !email) return res.status(400).json({
            success: false,
            message: "fleids are required"
        })
        let uploadfile = null
        if (file) {
            uploadfile = await sendfile(file.buffer, file.orignalname)
        }

        const user = await userModel.create({
            username,
            fullname,
            email,
            password,
            mobile_no,
            profile_pic: upoaldfile?.url || ""
        })

        const accessToken = generateToken(user._id, "15m")
        const refreshToken = generateToken(user._id, "2d")

        res.cookie("accessToken", accessToken, {
            httpOnly: true,
            maxAge: 15 * 60 * 1000,
            secure: false,
            sameSite: "strict"
        })
        res.cookie("refreshToken", refreshToken, {
            httpOnly: true,
            maxAge: 2 * 24 * 60 * 60 * 1000,
            secure: false,
            sameSite: "strict"
        })

        return res.status(201).json({
            success: true,
            message: "user is registered",
            user
        })


    } catch (error) {
        return res.status(500).json({
            success: false,
            message: "internal server error",
            error
        })
    }
}

export const loginUser = async (req, res) => {
    try {
        const { email, password } = req.body
        if (!email || !password) return res.stutes(400).json({
            success: false,
            message: "feilds are required"
        })

        const user = await userModel.findOne({ email }).select(password)

        if (!user) return res.status(404).json({
            success: false,
            message: "user not found"
        })

        if (!user.password || user.authProvider === "google") return res.status(400).json({
            success: false,
            message: "continues with google"
        })

        const iscomparePassword = user.comparePass(password)

        if (!iscomparePassword) {
            return res.status(401).json({
                success: false,
                message: "Invalid email or password"
            });
        }

        const accessToken = generateToken(user._id, "15m")
        const refreshToken = generateToken(user._id, "2d")

        res.cookie("accessToken", accessToken, {
            httpOnly: true,
            maxAge: 15 * 60 * 1000,
            secure: false,
            sameSite: "strict"
        })
        res.cookie("refreshToken", refreshToken, {
            httpOnly: true,
            maxAge: 2 * 24 * 60 * 60 * 1000,
            secure: false,
            sameSite: "strict"
        })

        let userData = user.toObject()

        delete userData.password

        return res.status(200).json({
            success: true,
            message: "user logged in",
            user: userData
        })


    } catch (error) {
        return res.status(500).json({
            success: false,
            message: "internal server error",
            error
        })
    }
}

export const googleUser = async (req, res) => {
    try {
        console.log(req.user)
        const email = req.user.emails?.[0]?.value
        const user = await userModel.findOne({ email })
        if (user) {

            if (!user.googleId) {
                user.googleId = req.user.id;
            }

            await user.save();

            const accessToken = generateToken(user._id, "15m")
            const refreshToken = generateToken(user._id, "2d")

            res.cookie("accessToken", accessToken, {
                httpOnly: true,
                maxAge: 15 * 60 * 1000,
                secure: false,
                sameSite: "strict"
            })
            res.cookie("refreshToken", refreshToken, {
                httpOnly: true,
                maxAge: 2 * 24 * 60 * 60 * 1000,
                secure: false,
                sameSite: "strict"
            })
            return res.status(200).json({
                success: true,
                message: "user is logged in",
                user
            })
            // return res.redirect("http://localhost:5173/")
        }
        const newUser = await userModel.create({
            username: req.user.name?.givenName,
            fullname: req.user.displayName,
            email: email,
            profile_pic: req.user.photos?.[0]?.value || "",
            authProvider: req.user.provider,
            googleId: req.user.id
        })
        const accessToken = generateToken(newUser._id, "15m")
        const refreshToken = generateToken(newUser._id, "2d")

        res.cookie("accessToken", accessToken, {
            httpOnly: true,
            maxAge: 15 * 60 * 1000,
            secure: false,
            sameSite: "strict"
        })
        res.cookie("refreshToken", refreshToken, {
            httpOnly: true,
            maxAge: 2 * 24 * 60 * 60 * 1000, secure: false,
            sameSite: "strict"
        })
        return res.status(201).json({
            success: true,
            message: "user registered with google"
        })
        // return res.redirect("http://localhost:5173/")
    } catch (error) {
        console.error("GOOGLE LOGIN ERROR:", error);
        return res.status(500).json({
            success: false,
            message: "internal server error",
            error
        })
    }
}

export const sendOtp = async (req, res) => {
    try {
        const { email } = req.body
        if (!email) return res.status(400).json({
            success: false,
            message: "email is required"
        })

        const user = await userModel.findOne({ email })
        if (!user) return res.status(404).json({
            success: false,
            message: "user is not found"
        })
        // generate otp 4 no. ki 
        const otp = generateOtp()
        // hash otp for security reason
        const hashedOtp = bcrypt.hashSync(otp, 10)
        // store otp in redis
        const otpKey = `otp:${email}`;
        await redis.set(
            otpKey,
            JSON.stringify({
                otp: hashedOtp,
                userId: user._id.toString()
            }),
            "EX",
            300
        )
        // otp attempt
        const attemptKey = `otp_attempts:${email}`;
        await redis.set(
            attemptKey,
            "0",
            "EX",
            300
        );

        await sendEmail(
            email,

            "Password Reset OTP",
            `Your OTP is ${otp}. This OTP will expire in 5 minutes.`,

            ` <div>
                    <h2>Password Reset</h2>

                    <p>Your OTP is :</p>

                    <h1>${otp}</h1>

                    

                    <p>If you did not request this OTP,
                       please ignore this email
                    </p>   
                </div>`
        )

        return res.status(200).json({
            success: true,
            message: "Otp sent successfully"
        })

    } catch (error) {
        console.log(error)
        return res.status(500).json({
            success: false,
            message: "internal server error",
            error
        })
    }
}

export const verifyOtp = async (req, res) => {
    try {
        const { email, otp } = req.body
        if (!email || !otp) return res.status(400).json({
            success: false,
            message: "email and otp is required"
        })
        const otpKey = `otp:${email}`
        const attemptKey = `otp_attempts:${email}`
        const data = await redis.get(otpKey)
        console.log(data)
        if (!data) return res.status(400).json({
            success: false,
            message: "OTP is expired or not found"
        })
        const { otp: hashedOtp, userId } = JSON.parse(data)

        const isValid = bcrypt.compareSync(otp, hashedOtp)

        if (!isValid) {

            const attempts = await redis.incr(attemptKey);

            // Set 5-minute expiry on the first failed attempt
            if (attempts === 1) {
                await redis.expire(attemptKey, 300);
            }
            // If user enters the wrong OTP 5 times,
            // delete the OTP and attempt counter from Redis
            if (attempts >= 5) {

                await redis.del(otpKey);
                await redis.del(attemptKey);

                return res.status(429).json({
                    success: false,
                    message: "Too many invalid attempts. Please request a new OTP."
                });
            }
            return res.status(403).json({
                success: false,
                message: "OTP is invalid",
                attemptsLeft: 5 - attempts
            });
        }
        // Generate a JWT reset token with a 10-minute expiry
        const resetToken = generateToken(userId, "10m");
        // Create a Redis reset session using the userId.
        // The userId is used to match the JWT decoded.id
        const resetKey = `password_reset:${userId}`;

        await redis.set(
            resetKey,
            "valid",
            "EX",
            600
        );
        // OTP is successfully verified,
        // so delete the OTP and attempt counter from Redis
        await redis.del(otpKey);
        await redis.del(attemptKey);

        // Store the reset token in an HttpOnly cookie
        // so JavaScript cannot directly access the token
        res.cookie("resetToken", resetToken, {
            httpOnly: true,
            maxAge: 10 * 60 * 1000,
            secure: false,
            sameSite: "strict"
        })
        return res.status(200).json({
            success: true,
            message: "OTP verified successfully"
        })
    } catch (error) {
        console.log(error)
        return res.status(500).json({
            success: false,
            message: "internal server error",
            error
        })
    }
}

export const resetPassword = async (req, res) => {
    try {
        const { newpassword } = req.body
        // Get the reset token from the cookie
        // that was created during OTP verification
        const resetToken = req.cookies.resetToken
        if (!resetToken || !newpassword) return res.status(400).json({
            success: false,
            message: "email and new password is required"
        })
        // Verify the JWT and get the user's id from decoded.id
        const decoded = jwt.verify(
            resetToken,
            process.env.JWT_SECRET
        );
        // Create the same Redis key using the userId
        // that was stored during OTP verification
        const resetKey = `password_reset:${decoded.id}`;
        // Check whether the reset session is still valid in Redis
        const session = await redis.get(resetKey)
        // If Redis session does not exist,
        // the token is expired or has already been used
        if (!session) {
            return res.status(401).json({
                success: false,
                message: "reset token is expired or already used"
            });
        }
        // Find the user using the id stored inside the JWT
        const user = await userModel.findById(decoded.id)
        if (!user) return res.status(404).json({
            success: false,
            message: "user is not found"
        })
        // Update the user's password
        user.password = newpassword
        // newpassword save
        await user.save();
        // Delete the Redis session so the reset token
        // cannot be used again
        await redis.del(resetKey);
        // Remove the reset token cookie
        res.clearCookie("resetToken");
        return res.status(200).json({
            success: true,
            message: "password is successfully updated"
        })
    } catch (error) {
        console.log(error)
        return res.status(500).json({
            success: false,
            message: "internal server error",
            error
        })
    }
}

export const resendOtp = async (req, res) => {
    try {
        const { email } = req.body;

        if (!email) {
            return res.status(400).json({
                success: false,
                message: "email is required"
            });
        }

        const user = await userModel.findOne({ email });

        if (!user) {
            return res.status(404).json({
                success: false,
                message: "user is not found"
            });
        }

        const otpKey = `otp:${email}`;
        const attemptKey = `otp_attempts:${email}`;

        await redis.del(otpKey);
        await redis.del(attemptKey);

        const otp = generateOtp();


        const hashedOtp =  bcrypt.hashSync(otp, 10);

    
        await redis.set(
            otpKey,
            JSON.stringify({
                otp: hashedOtp,
                userId: user._id.toString()
            }),
            "EX",
            300
        );


        await redis.set(
            attemptKey,
            "0",
            "EX",
            300
        );

    
        await sendEmail(
            email,
            "Password Reset OTP",
            `Your new OTP is ${otp}. This OTP will expire in 5 minutes.`,
            `<div>
                <h2>Password Reset</h2>
                <p>Your new OTP is:</p>
                <h1>${otp}</h1>
                <p>This OTP will expire in 5 minutes.</p>
                <p>If you did not request this OTP, please ignore this email.</p>
            </div>`
        );

        return res.status(200).json({
            success: true,
            message: "OTP resent successfully"
        });

    } catch (error) {
        console.log(error);

        return res.status(500).json({
            success: false,
            message: "internal server error"
        });
    }
};


export const deleteUser = async (req, res) => {
    try {
        const { email, password } = req.body
        if (!email || !password) return res.status(400).json({
            success: false,
            message: "all feild are required"
        })

        if (email !== req.user.email) {
            return res.status(403).json({
                success: false,
                message: "you can only delete your own account"
            });
        }
        const user = await userModel.findOne({ email })


        if (!user) return res.status(404).json({
            success: false,
            message: "user not found"
        })
        const isPasswordCorrect = user.comparePass(
            password,
            user.password
        );
        if (!isPasswordCorrect) return res.status(401).json({
            success: false,
            message: "pessword is incorrect"
        })
        await userModel.findOneAndDelete({ email })

        return res.status(200).json({
            success: true,
            message: "user is successfully deleted"
        })
    } catch (error) {
        console.log(error)
        return res.status(500).json({
            success: false,
            message: "internal server error",
            error
        })
    }
}

export const resetToken = async (req, res) => {
    try {
        const { refreshToken } = req.cookies
        if (!refreshToken) return res.status(401).json({
            success: false,
            message: "unautherized"
        })

        const verifyrefreshToken = jwt.verify(refreshToken, process.env.JWT_SECRET)

        const user = await userModel.findById(verifyrefreshToken.id)
        if (!user) return res.status(404).json({
            success: false,
            message: "user not found"
        })

        const accessToken = generateToken(user._id, "1m")

        res.cookie("accessToken", accessToken, {
            httpOnly: true,
            maxAge: 1 * 60 * 1000,
            secure: false,
            sameSite: "strict"
        })

        return res.status(200).json({
            success: true,
            message: "access token re-generated successfully"
        })
    }
        
     catch (error) {
    console.log(error)
    return res.status(500).json({
        success: false,
        message: "internal server error",
        error
    })
}
}