import React, { useEffect, useState } from "react"
import { Link } from "react-router"
import { useAuth } from "../hooks/useAuth"


const Forget = () => {
  const { loading, handleForgetPassword } = useAuth()
  const [email, setEmail] = useState("")
  const [error, setError] = useState("")

  const handleSubmit = async (event) => {
    event.preventDefault()
    setError("")

    try {
      await handleForgetPassword(email)
    } catch (err) {
      setError(err.response?.data?.message || "Unable to send reset code.")
    }
  }

useEffect(() => {
  if (error) {
    alert(error);
  }
}, [error]);

  return (
    <section className="min-h-screen bg-slate-100 px-6 py-10">
      <form
        className="mx-auto flex w-full max-w-md flex-col gap-3 rounded-xl bg-white p-6 shadow"
        onSubmit={handleSubmit}
      >
        <h1 className="text-3xl font-semibold text-slate-900">Forgot Password</h1>
        <p className="text-sm text-slate-600">Enter your email to receive a reset code.</p>

        <label className="font-medium text-slate-800" htmlFor="email">
          Email
        </label>
        <input
          id="email"
          name="email"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="you@example.com"
          className="rounded-md border border-slate-300 px-3 py-2 outline-none focus:border-slate-500"
        />

        <button
          type="submit"
          className="mt-2 rounded-md bg-slate-900 px-4 py-2 text-white transition hover:bg-slate-700"
          disabled={loading}
        >
          {loading ? "Sending code..." : "Send Reset Code"}
        </button>

        

        <p className="text-sm text-slate-600">
          Remembered it? <Link to="/login">Back to login</Link>
        </p>
      </form>
    </section>
  )
}

export default Forget
