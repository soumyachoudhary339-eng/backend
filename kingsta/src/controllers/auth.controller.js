import userModel from "../models/user.model.js"
import { sendfile } from "../services/storage.service.js"
import { genrateToken } from "../utils/token.js"
import sendEmail from "../services/email.service.js"
import jwt from "jsonwebtoken"

export const registerController = async (req, res) => {
    try {
        const {
            username,
            fullname,
            email,
            mobile,
            password } = req.body
        const file = req.file

        if (!file) {
            return res.status(400).json({
                success: false,
                message: "Profile image required"
            })
        }
        if (!username || !fullname || !email || !mobile || !password) {
            return res.status(400).json({
                success: false,
                message: "all field are required"
            })
        }
        const uploadfile = await sendfile(file.buffer, file.originalname)
        console.log(req.file)
        const newUser = await userModel.create({
            username,
            fullname,
            email,
            mobile,
            password,
            profile_pic: uploadfile.url
        })
        const accessToken = genrateToken(newUser._id, "15min")
        const refreshToken = genrateToken(newUser._id, "1d")
        res.cookie("accessToken",
            accessToken,
            {
                httpOnly: true,
                expire: 15 * 60 * 1000
            })
        res.cookie("refreshToken",
            refreshToken,
            {
                httpOnly: true,
                expire: 24 * 60 * 60 * 1000
            })

        return res.status(201).json({
            success: true,
            message: "User register successfully",
            newUser,
            token: accessToken
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
export const loginController = async (req, res) => {
    try {
        const {
            email,
            password } = req.body
        const file = req.file
        if (!email || !password) {
            return res.status(400).json({
                success: false,
                message: "all field are required"
            })
        }
        console.log(req.body)

        const isExisted = await userModel.findOne({ email })
        if (!isExisted) {
            return res.status(404).json({
                success: false,
                message: "user not found"
            })
        }
        const checkpass = await isExisted.comparePass(password)
        if (!checkpass) {
            return res.status(401).json({
                success: false,
                message: "invalid credentials"
            })
        }
        const accessToken = genrateToken(isExisted._id, "15min")
        const refreshToken = genrateToken(isExisted._id, "1d")
        res.cookie("accessToken",
            accessToken,
            {
                httpOnly: true,
                expire: 15 * 60 * 1000
            })
        res.cookie("refreshToken",
            refreshToken,
            {
                httpOnly: true,
                expire: 24 * 60 * 60 * 1000
            })

        return res.status(200).json({
            success: true,
            message: "User loggedin successfully",
            user: isExisted
        })
    } catch (error) {
        console.log(error)
        return res.status(500).json({
            success: false,
            message: "internal server error",
            error: error.message
        })
    }
}

export const logoutController = async (req, res) => {
    try {
        res.clearCookie("accessToken", {
            httpOnly: true,
        });

        res.clearCookie("refreshToken", {
            httpOnly: true,
        });

        return res.status(200).json({
            success: true,
            message: "User logout successfully"
        });

    } catch (error) {
        console.log(error);
        return res.status(500).json({
            success: false,
            message: "Internal server error"
        });
    }
};

export const forgetpassword = async (req, res) => {
    try {
        const { email } = req.body
        if (!email) return res.status(400).json({
            success: false,
            message: "email is required"
        })
        const user = await userModel.findOne(email)
        if (!user) return res.status(404).json({
            success: false,
            message: "user not found"
        })
        const resetToken = genrateToken(user._id, "10m")
        const resetUrl = `http//localhost:5173/reset-pssword?token=${resetToken}`
        sendEmail(
            user.email,
            "Reset Your Kingsta Password",
            `Reset your password using this link: ${resetUrl}`,
            `<h2>Reset Your Password</h2>
             <p>Click the button below to reset your password.</p>

             <a href="${resetUrl}">
            Reset Password
              </a>

            <p>This link expires in 10 minutes.</p>`
        );
        return res.status(200).json({
            success: true,
            message: "email sent successfully"
        })
    } catch (error) {
        console.log(error);
        return res.status(500).json({
            success: false,
            message: "Internal server error"
        });
    }
}

export const resetPassword = async (req, res) => {
    try {
        const { token, newpassword } = req.body
        if (!token || !newpassword) return res.status(400).json({
            success: false,
            message: "token and new password is required"
        })

        const decode = jwt.verify("token", process.env.SecretKey)
        if (!decode) return res.status(401).json({
            success: false,
            message: "unauthorize"
        })
        const user = await userModel.findById(decode.id)
        user.password = newpassword
        await user.save()
        return res.status(200).json({
            success: true,
            message: "password updated successfully"
        })


    } catch (error) {
        console.log(error);
        return res.status(500).json({
            success: false,
            message: "Internal server error"
        });
    }
}

export const googleAuth = async (req, res) => {
        try {
            const email = req.user.emails?.[0]?.value;

                console.log(req.user)
            // 1. Check user already registered hai ya nahi
            let User = await userModel.findOne({ email });
            if (User) {

                const accessToken = genrateToken(User._id, "15min");
                const refreshToken = genrateToken(User._id, "7d");

                res.cookie("accessToken", accessToken, {
                    httpOnly: true,
                    maxAge: 15 * 60 * 1000,
                });

                res.cookie("refreshToken", refreshToken, {
                    httpOnly: true,
                    maxAge: 7 * 24 * 60 * 60 * 1000,
                });

                return res.redirect("http://localhost:5173/");
            }
            // 2. User nahi hai → REGISTER

            user = await userModel.create({
                username: req.user.name.givenName?.toLowerCase(),
                fullname: req.user.displayName,
                email: email,
                profile_pic: req.user.photos?.[0]?.value || "",
                password: "GOOGLE_USER",
            });
            const accessToken = genrateToken(user._id, "15min");
            const refreshToken = genrateToken(user._id, "1d");

            res.cookie("accessToken", accessToken, {
                httpOnly: true,
                maxAge: 15 * 60 * 1000,
            });

            res.cookie("refreshToken", refreshToken, {
                httpOnly: true,
                maxAge: 24 * 60 * 60 * 1000,
            });

            return res.redirect("http://localhost:5173/");

            // 3. req.user me MongoDB user jayega
            return done(null, user);
        } catch (error) {
            console.log(error);

            return res.status(500).json({
                success: false,
                message: "Google login failed",
                error: error.message,
            });
        }
    }