import { Router } from "express";

import * as authController from "../controller/auth.controller.js"

const authRouter = Router()

authRouter.post('/register', authController.register)

authRouter.post('/login', authController.login)

authRouter.get('/logout', authController.logout)

authRouter.get('/get-me', authController.getMe)

authRouter.get('/logout-all', authController.logoutAll)

authRouter.get("/refresh-token", authController.refreshToken)

authRouter.post("/verify-email", authController.verifyEmail)
authRouter.post("/forgot-password", authController.forgetPassword)
authRouter.post("/reset-password", authController.resetPassword)
export default authRouter;