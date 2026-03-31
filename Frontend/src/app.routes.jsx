import { createBrowserRouter } from "react-router";
import Home from "./features/Home/Home";
import Login from "./features/auth/pages/Login";
import Reset from "./features/auth/pages/Reset";
import Forget from "./features/auth/pages/Forget";
import Regsiter from "./features/auth/pages/Regsiter";
import Verify from "./features/auth/pages/Verify";
import ProtectedRoute from "./features/auth/components/ProtectedRoute";
import PublicRoute from "./features/auth/components/PublicRoute";

export const router = createBrowserRouter([
    {
        path:"/",
        element:<ProtectedRoute><Home/></ProtectedRoute>
    }, 
    {
        path:"/login",
        element:<PublicRoute><Login/></PublicRoute>
    },
    {
        path:"/register",
        element:<PublicRoute><Regsiter/></PublicRoute>
    },
    {
        path:"/verify-email",
        element:<PublicRoute><Verify/></PublicRoute>
    },
    {
        path:"/forgot-password",
        element:<PublicRoute><Forget/></PublicRoute>
    },
    {
        path:"/reset-password",
        element:<PublicRoute><Reset/></PublicRoute>
    },
])
