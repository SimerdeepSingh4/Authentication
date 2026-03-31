import userModel from "../models/user.model.js";
import crypto from "crypto"
import jwt from "jsonwebtoken"
import config from "../config/config.js";
import sessionModel from "../models/session.model.js";
import { sendEmail } from "../services/email.service.js";
import otpModel from "../models/otp.model.js";
import { generateOTP, getOtpHtml } from "../utils/util.js";
import bcrypt from "bcryptjs"

const refreshCookieOptions = {
    httpOnly: true,
    maxAge: 7 * 24 * 60 * 60 * 1000,
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict"
};


export async function register(req, res) {
    const { username, email, password } = req.body;

    const isUserExists = await userModel.findOne({
        $or: [
            { username },
            { email }
        ]
    })

    if (isUserExists) {
        return res.status(409).json({
            message: "User already exists",
        });
    }
    const hash = await bcrypt.hash(password, 10);

    const user = await userModel.create({
        username,
        email,
        password: hash
    })

    const otp = generateOTP();
    const html = getOtpHtml(otp);

    const otpHash = crypto.createHash("sha256").update(otp).digest("hex");
    await otpModel.create({
        email,
        user: user._id,
        otpHash
    })

    const refreshToken = jwt.sign({
        id: user._id
    }, config.JWT_SECRET, {
        expiresIn: '7d'
    }
    )

    const refreshTokenHash = crypto.createHash("sha256").update(refreshToken).digest("hex");

    const session = await sessionModel.create({
        user: user._id,
        refreshTokenHash,
        ip: req.ip,
        userAgent: req.headers["user-agent"]
    })

    const accessToken = jwt.sign({
        id: user._id,
        sessionId: session._id
    }, config.JWT_SECRET,
        {
            expiresIn: '15m'
        }
    )



    res.cookie("refreshToken", refreshToken, refreshCookieOptions)

    await sendEmail(email, "OTP Verfication", `Your OTP is ${otp}`, html)

    return res.status(201).json({
        message: "User registered successfully",
        user: {
            username: user.username,
            email: user.email,
            verified: user.verified,
        },

    })

}



export async function getMe(req, res) {
    const token = req.headers.authorization?.split(" ")[1];

    if (!token) {
        return res.status(401).json({
            message: "token not found"
        })
    }

    const decoded = jwt.verify(token, config.JWT_SECRET)

    const user = await userModel.findById(decoded.id)

    res.status(200).json({
        message: "user fetched successfully",
        user: {
            username: user.username,
            email: user.email,
        }
    })
}

export async function refreshToken(req, res) {
    const refreshToken = req.cookies.refreshToken;

    if (!refreshToken) {
        return res.status(401).json({
            message: "Refresh token not found"
        })
    }

    const decoded = jwt.verify(refreshToken, config.JWT_SECRET)

    const refreshTokenHash = crypto.createHash('sha256').update(refreshToken).digest('hex');

    const session = await sessionModel.findOne({
        refreshTokenHash,
        revoked: false
    })

    if (!session) {
        return res.status(401).json({
            message: "Invalid refresh token"
        })
    }


    const accessToken = jwt.sign({
        id: decoded.id
    }, config.JWT_SECRET, { expiresIn: '15m' })

    const newRefreshToken = jwt.sign({
        id: decoded.id
    }, config.JWT_SECRET, { expiresIn: '7d' })


    const newRefreshTokenHash = crypto.createHash('sha256').update(newRefreshToken).digest('hex');

    session.refreshTokenHash = newRefreshTokenHash;
    await session.save();

    res.cookie("refreshToken", newRefreshToken, refreshCookieOptions)

    res.status(200).json({
        message: "Token refreshed successfully",
        accessToken
    })
}

export async function login(req, res) {
    const { email, password } = req.body
    const user = await userModel.findOne({ email })

    if (!user) {
        return res.status(401).json({
            message: "Invalid email or password"
        })
    }

    if (!user.verified) {
        return res.status(401).json({
            message: "User not verified"
        })
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (!isPasswordValid) {
        return res.status(401).json({
            message: "Invalid email or password"
        })
    }

    const refreshToken = jwt.sign({
        id: user._id,
    }, config.JWT_SECRET,
        {
            expiresIn: "7d"
        }
    )

    const refreshTokenHash = crypto.createHash("sha256").update(refreshToken).digest("hex");

    const session = await sessionModel.create({
        user: user._id,
        refreshTokenHash,
        ip: req.ip,
        userAgent: req.headers["user-agent"]
    })

    const accessToken = jwt.sign({
        id: user._id,
    }, config.JWT_SECRET,
        {
            expiresIn: "7d"
        }
    )

    res.cookie("refreshToken", refreshToken, refreshCookieOptions)

    res.status(200).json({
        message: "Logged in successfully",
        user,
        accessToken
    })
}

export async function logout(req, res) {

    const refreshToken = req.cookies.refreshToken;

    if (!refreshToken) {
        return res.status(400).json({
            message: "Refresh token not found"
        })
    }

    const refreshTokenHash = crypto.createHash('sha256').update(refreshToken).digest('hex');

    const session = await sessionModel.findOne({
        refreshTokenHash,
        revoked: false
    })

    if (!session) {
        return res.status(400).json({
            message: "Invalid refresh token"
        })
    }

    session.revoked = true;
    await session.save();

    res.clearCookie("refreshToken");

    return res.status(200).json({
        message: "Logged out successfully"
    })

}

export async function logoutAll(req, res) {

    const refreshToken = req.cookies.refreshToken;

    if (!refreshToken) {
        return res.status(400).json({
            message: "Refresh token not found"
        })
    }

    const decoded = jwt.verify(refreshToken, config.JWT_SECRET)

    await sessionModel.updateMany({
        user: decoded.id,
        revoked: false
    }, {
        revoked: true
    })

    res.clearCookie("refreshToken")

    res.status(200).json({
        message: "Logged out from all devices successfully"
    })
}

export async function verifyEmail(req, res) {
    const { otp, email } = req.body

    const otpHash = crypto.createHash("sha256").update(otp).digest("hex");

    const otpDoc = await otpModel.findOne({
        email,
        otpHash
    })

    if (!otpDoc) {
        return res.status(400).json({
            message: "Invalid OTP"
        })
    }
    const user = await userModel.findByIdAndUpdate(otpDoc.user, {
        verified: true

    })

    await otpModel.deleteMany({
        user: otpDoc.user
    });

    res.status(200).json({
        message: "Email verified successfully"
    })
}

export async function forgetPassword(req, res) {
    const { email } = req.body;
    if (!email) return res.status(400).json({ message: "Email is required" });

    const user = await userModel.findOne({ email });
    if (!user) {
        return res.status(404).json(
            {
                message: "User not found",
                success: false
            }
        );
    }

    const otp = generateOTP();
    const otpHash = crypto.createHash("sha256").update(otp).digest("hex");

    await otpModel.findOneAndUpdate(
        { email, user: user._id },
        { otpHash },
        { upsert: true, new: true, setDefaultsOnInsert: true }
    );

    const html = getOtpHtml(otp);
    await sendEmail(email, "Reset Password OTP", `Your password reset OTP is ${otp}`, html);

    return res.status(200).json({ message: "If the email exists, OTP sent" });
}

export async function resetPassword(req, res) {
    const { email, otp, newPassword } = req.body;

    if (!email || !otp || !newPassword) {
        return res.status(400).json({ message: "Email, OTP and newPassword are required" });
    }

    const otpHash = crypto.createHash("sha256").update(otp).digest("hex");
    const otpDoc = await otpModel.findOne({ email, otpHash });
    if (!otpDoc) {
        return res.status(400).json({ message: "Invalid OTP" });
    }

    const hashedPassword = await bcrypt.hash(newPassword, 10);
    await userModel.findByIdAndUpdate(otpDoc.user, { password: hashedPassword });

    await otpModel.deleteMany({ user: otpDoc.user });

    return res.status(200).json({ message: "Password reset successful" });
}
