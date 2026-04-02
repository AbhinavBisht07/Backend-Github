import { createBrowserRouter } from "react-router";
import Login from "../features/auth/pages/Login";
import Register from "../features/auth/pages/Register";
import Dashboard from "../features/chat/pages/Dashboard";
import Protected from "../features/auth/components/Protected";
import { Navigate } from "react-router";
import VerifyEmail from "../features/auth/pages/VerifyEmail";

export const router = createBrowserRouter([
    {
        path: "/login",
        element: <Login />
    },
    {
        path: "/register",
        element: <Register />
    },
    {
        path: "verify-email",
        element: <VerifyEmail />
    },
    {
        path: "/",
        element: 
        <Protected>
            <Dashboard />
        </Protected>
    },
    // ab agar user /dashboard bhi likhega to bhi / wale path mein navigate hojaega .. jo hai hi dashboard apna
    {
        path: "/dashboard",
        element: <Navigate to='/' replace/>
    }
])