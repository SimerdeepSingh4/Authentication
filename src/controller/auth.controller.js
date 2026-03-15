import userModel from "../models/user.model.js";
import crypto from "crypto"
import jwt from "jsonwebtoken"
import config from "../config/config.js";
import sessionModel from "../models/session.model.js";




export async function register(req, res) {
    const { username, email, password } = req.body;

    const isUserExists = await userModel.findOne({
        $or: [
            { username },
            { email }
        ]
    })

    if (isUserExists) {
        res.status(409).json({
            message: "User already exists",
        })
    }
    const hash = await crypto.createHash("sha256").update(password).digest("hex");
    const user = new userModel.create({
        username,
        email,
        password: hash
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
        ip:req.ip,
        userAgent:req.headers["user-agent"]
    })

    const accessToken = jwt.sign({
        id: user._id,
        sessionId: session._id
    }, config.JWT_SECRET,
        {
            expiresIn: '15m'
        }
    )



    res.cookie("refreshToken", refreshToken, {
        httpOnly: true,
        maxAge: 7 * 24 * 60 * 60 * 1000, //7d
        secure: true,
        sameSite: "strict"
    })


    return res.status(201).json({
        message: "User created successfully",
        user,
        accessToken
    })

}

async function getMe(req, res) {
}

export async function refreshToken(req, res) {
    const refreshToken = req.cookies.refreshToken;

    if (!refreshToken) {
        return res.status(401).json({
            message: "Unauthorized"
        })
    }

    const decoded = jwt.verify(refreshToken, config.JWT_SECRET)

    const accessToken = jwt.sign({
        id: decoded.id
    }, config.JWT_SECRET, { expiresIn: '15m' })

    const newRefreshToken = jwt.sign({
        id: decoded.id
    }, config.JWT_SECRET, { expiresIn: '7d' })



    res.cookie("refreshToken", refreshToken, {
        httpOnly: true,
        maxAge: 7 * 24 * 60 * 60 * 1000, //7d
        secure: true,
        sameSite: "strict"
    })

    res.status(200).json({
        message: "Token refreshed successfully",
        accessToken
    })
}