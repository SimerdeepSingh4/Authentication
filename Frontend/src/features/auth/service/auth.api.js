import axios from "axios"


const api = axios.create({
    baseURL:"/api/auth",
    withCredentials:true
})

const ACCESS_TOKEN_KEY = "accessToken"

function getAccessToken() {
    return localStorage.getItem(ACCESS_TOKEN_KEY)
}

function setAccessToken(token) {
    if (token) {
        localStorage.setItem(ACCESS_TOKEN_KEY, token)
    }
}

function clearAccessToken() {
    localStorage.removeItem(ACCESS_TOKEN_KEY)
}

api.interceptors.request.use((config) => {
    const token = getAccessToken()

    if (token) {
        config.headers = config.headers ?? {}
        config.headers.Authorization = `Bearer ${token}`
    }

    return config
})

export async function refreshAccessToken() {
    const response = await api.get("/refresh-token")
    setAccessToken(response.data.accessToken)
    return response.data
}

export async function register(username, email, password) {
    const response = await api.post("/register",{
        username, email, password
    })

    return response.data
}

export async function verifyEmail(email, otp) {
    const response = await api.post("/verify-email", {
        email,
        otp,
    })

    return response.data
}

export async function login(email, password) {
    const response = await api.post("/login",{
        email, password
    })

    setAccessToken(response.data.accessToken)
    return response.data
}

export async function logout() {
    const response = await api.get("/logout")

    clearAccessToken()
    return response.data
}

export async function getMe() {
    try {
        const response = await api.get("/get-me")
        return response.data
    } catch (error) {
        if (error.response?.status !== 401) {
            throw error
        }

        try {
            await refreshAccessToken()
            const response = await api.get("/get-me")
            return response.data
        } catch {
            clearAccessToken()
            return { user: null }
        }
    }
}

export async function forgetPassword(email){
    const response = await api.post("/forgot-password",{
        email
    })

    return response.data
}

export async function resetPassword(email, otp, newPassword){
    const response = await api.post("/reset-password",{
        email, otp, newPassword
    })

    return response.data
}
