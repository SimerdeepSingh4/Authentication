import React, { useState } from "react"
import { Link, useLocation } from "react-router"
import { useAuth } from "../hooks/useAuth"

const VERIFY_EMAIL_KEY = "pendingVerificationEmail"

const Verify = () => {
  const location = useLocation()
  const { loading, handleVerifyEmail } = useAuth()
  const [email, setEmail] = useState(
    location.state?.email || sessionStorage.getItem(VERIFY_EMAIL_KEY) || ""
  )
  const [otp, setOtp] = useState("")

  const handleSubmit = async (event) => {
    event.preventDefault()
    sessionStorage.setItem(VERIFY_EMAIL_KEY, email)
    await handleVerifyEmail(email, otp)
    sessionStorage.removeItem(VERIFY_EMAIL_KEY)
  }

  return (
    <section className="min-h-screen bg-slate-100 px-6 py-10">
      <form
        className="mx-auto flex w-full max-w-md flex-col gap-3 rounded-xl bg-white p-6 shadow"
        onSubmit={handleSubmit}
      >
        <h1 className="text-3xl font-semibold text-slate-900">Verify Email</h1>
        <p className="text-sm text-slate-600">Enter the OTP sent on your email to activate your account.</p>

        <label className="font-medium text-slate-800" htmlFor="email">
          Email
        </label>
        <input
          id="email"
          type="email"
          value={email}
          onChange={(event) => setEmail(event.target.value)}
          className="rounded-md border border-slate-300 px-3 py-2 outline-none focus:border-slate-500"
          placeholder="you@example.com"
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
        />

        <button
          type="submit"
          disabled={loading}
          className="mt-2 rounded-md bg-slate-900 px-4 py-2 text-white transition hover:bg-slate-700"
        >
          {loading ? "Verifying..." : "Verify and Continue"}
        </button>

        <p className="text-sm text-slate-600">
          Already verified? <Link to="/login">Go to login</Link>
        </p>
      </form>
    </section>
  )
}

export default Verify
