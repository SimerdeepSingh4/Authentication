import { Navigate } from "react-router"
import { useAuth } from "../hooks/useAuth"

const PublicRoute = ({ children }) => {
  const { user, loading, initialized } = useAuth()

  if (!initialized || loading) {
    return (
      <section className="flex min-h-screen items-center justify-center bg-slate-100">
        <p className="text-sm text-slate-600">Loading....</p>
      </section>
    )
  }

  if (user) {
    return <Navigate to="/" replace />
  }

  return children
}

export default PublicRoute
