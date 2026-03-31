import React, { useMemo, useState } from "react"
import { Link, useLocation, Navigate } from "react-router"
import { useAuth } from "../hooks/useAuth"

const RESET_EMAIL_KEY = "pendingResetEmail"

const Reset = () => {
  const location = useLocation()
  const { loading, handleResetPassword } = useAuth()
  const [otp, setOtp] = useState("")
  const [otpVerified, setOtpVerified] = useState(false)
  const [newPassword, setNewPassword] = useState("")
  const email = useMemo(
    () => location.state?.email || sessionStorage.getItem(RESET_EMAIL_KEY) || "",
    [location.state]
  )

  if (!email) {
    return <Navigate to="/forgot-password" replace />
  }

  const handleOtpSubmit = (event) => {
    event.preventDefault()
    if (!otp.trim()) {
      return
    }
    setOtpVerified(true)
  }

  const handlePasswordSubmit = async (event) => {
    event.preventDefault()
    await handleResetPassword(email, otp, newPassword)
    sessionStorage.removeItem(RESET_EMAIL_KEY)
  }

  return (
    <section className="min-h-screen bg-slate-100 px-6 py-10">
      <form
        className="mx-auto flex w-full max-w-md flex-col gap-3 rounded-xl bg-white p-6 shadow"
        onSubmit={otpVerified ? handlePasswordSubmit : handleOtpSubmit}
      >
        <h1 className="text-3xl font-semibold text-slate-900">Reset Password</h1>
        <p className="text-sm text-slate-600">
          {!otpVerified
            ? "Enter the OTP sent to your email before setting a new password."
            : "Create your new password to finish resetting your account."}
        </p>

        <label className="font-medium text-slate-800" htmlFor="email">
          Email
        </label>
        <input
          id="email"
          type="email"
          value={email}
          readOnly
          className="rounded-md border border-slate-300 bg-slate-50 px-3 py-2 text-slate-500 outline-none"
        />

        <label className="font-medium text-slate-800" htmlFor="otp">
          OTP
        </label>
        <input
          id="otp"
          type="text"
          value={otp}
          onChange={(event) => setOtp(event.target.value)}
          className="rounded-md border border-slate-300 px-3 py-2 outline-none focus:border-slate-500"
          placeholder="Enter OTP"
          disabled={otpVerified}
        />

        {otpVerified && (
          <>
            <label className="font-medium text-slate-800" htmlFor="newPassword">
              New Password
            </label>
            <input
              id="newPassword"
              type="password"
              value={newPassword}
              onChange={(event) => setNewPassword(event.target.value)}
              className="rounded-md border border-slate-300 px-3 py-2 outline-none focus:border-slate-500"
              placeholder="Create a new password"
            />
          </>
        )}

        <button
          type="submit"
          className="mt-2 rounded-md bg-slate-900 px-4 py-2 text-white transition hover:bg-slate-700"
          disabled={loading}
        >
          {loading ? "Please wait..." : otpVerified ? "Set New Password" : "Verify OTP"}
        </button>

        {!otpVerified && (
          <p className="text-sm text-slate-600">
            Need another code? <Link to="/forgot-password">Go back</Link>
          </p>
        )}
      </form>
    </section>
  )
}

export default Reset
