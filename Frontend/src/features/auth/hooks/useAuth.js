import { useContext, useEffect } from "react"
import { AuthContext } from "../context/auth.context"
import {
    forgetPassword,
    getMe,
    login,
    refreshAccessToken,
    logout,
    register,
    resetPassword,
    verifyEmail,
} from "../service/auth.api"
import { useNavigate } from "react-router"


export const useAuth = () =>{
    const navigate = useNavigate()
    const context = useContext(AuthContext)
    if (!context) {
        throw new Error("useAuth must be used inside AuthProvider")
    }

    const {user, setUser, loading, setLoading, initialized, setInitialized} = context


    async function handleRegister(username, email, password) {
        setLoading(true)
        try {
            await register(username, email, password)
            setUser(null)
        } finally {
            setLoading(false)
        }
        navigate("/verify-email", { state: { email } })
    }

    async function handleVerifyEmail(email, otp) {
        setLoading(true)
        try {
            await verifyEmail(email, otp)
            await refreshAccessToken()
            const data = await getMe()
            setUser(data.user ?? null)
        } finally {
            setLoading(false)
        }
        navigate("/")
    }

    async function handleLogin(email, password) {
        setLoading(true)
        try {
            const data = await login(email, password)
            setUser(data.user)
        } finally {
            setLoading(false)
        }
        navigate("/")
    }

    async function handleGetMe() {
        setLoading(true)
        try {
            const data = await getMe()
            setUser(data.user ?? null)
        } catch {
            setUser(null)
        } finally {
            setInitialized(true)
            setLoading(false)
        }
    }

    async function handleLogout() {
        setLoading(true)
        try {
            await logout()
            setUser(null)
        } finally {
            setLoading(false)
        }
        navigate("/login")
    }

    async function handleForgetPassword(email) {
        setLoading(true)
        let data
        try {
            data = await forgetPassword(email)
        } finally {
            setLoading(false)
        }
        sessionStorage.setItem("pendingResetEmail", email)
        navigate("/reset-password", { state: { email } })
        return data
    }

    async function handleResetPassword(email, otp, newPassword) {
        setLoading(true)
        let data
        try {
            data = await resetPassword(email, otp, newPassword)
        } finally {
            setLoading(false)
        }
        navigate("/login")
        return data
    }



    useEffect(()=>{
        if (!initialized) {
            handleGetMe()
        }
    },[initialized])

    return {
        user,
        loading,
        initialized,
        handleRegister,
        handleVerifyEmail,
        handleLogin,
        handleGetMe,
        handleLogout,
        handleForgetPassword,
        handleResetPassword,
    }
}
