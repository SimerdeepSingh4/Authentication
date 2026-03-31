import React, { useState } from "react"
import { Link } from "react-router"
import { useAuth } from "../hooks/useAuth"

const Login = () => {
  const { loading, handleLogin } = useAuth()
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")

  const handleSubmit = (event) => {
    event.preventDefault()
    handleLogin(email, password)
  }

  return (
    <section className="min-h-screen bg-slate-100 px-6 py-10">
      <form
        className="mx-auto flex w-full max-w-md flex-col gap-3 rounded-xl bg-white p-6 shadow"
        onSubmit={handleSubmit}
      >
        <h1 className="text-3xl font-semibold text-slate-900">Login</h1>
        <p className="text-sm text-slate-600">Sign in with your email and password.</p>

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

        <label className="font-medium text-slate-800" htmlFor="password">
          Password
        </label>
        <input
          id="password"
          name="password"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="Enter your password"
          className="rounded-md border border-slate-300 px-3 py-2 outline-none focus:border-slate-500"
        />

        <button
          type="submit"
          className="mt-2 rounded-md bg-slate-900 px-4 py-2 text-white transition hover:bg-slate-700"
          disabled={loading}
        >
          {loading ? "Logging in..." : "Login"}
        </button>

        <p className="text-sm text-slate-600">
          New here? <Link to="/register">Create an account</Link>
        </p>
        <p className="text-sm text-slate-600">
          Forgot your password? <Link to="/forgot-password">Reset it</Link>
        </p>
      </form>
    </section>
  )
}

export default Login
