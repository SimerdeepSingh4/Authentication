import { createBrowserRouter } from "react-router";
import Home from "./features/Home/Home";
import Login from "./features/auth/pages/Login";
import Reset from "./features/auth/pages/Reset";
import Forget from "./features/auth/pages/Forget";
import Regsiter from "./features/auth/pages/Regsiter";

export const router = createBrowserRouter([
    {
        path:"/",
        element:<Home/>
    }, 
    {
        path:"/login",
        element:<Login/>
    },
    {
        path:"/register",
        element:<Regsiter/>
    },
    {
        path:"/forgot-password",
        element:<Forget/>
    },
    {
        path:"/reset-password",
        element:<Reset/>
    },
])
