import { createBrowserRouter } from "react-router";
import Register from "./features/auth/pages/Register";
import Login from "./features/auth/pages/Login";
import Protected from "./features/auth/components/Protected";
import Home from "./features/home/pages/Home";
import UploadSongs from "./features/song/pages/UploadSongs";
import AllSongs from "./features/song/pages/AllSongs";

export const router = createBrowserRouter([
    {
        path: "/",
        element: <Protected> <Home/> </Protected>
    },
    {
        path: "/register",
        element: <Register/>
    },
    {
        path: "/login",
        element: <Login/>
    },
    {
        path: "/upload-songs",
        element: <UploadSongs/>
    },
    {
        path: "/all-songs",
        element: <AllSongs/>
    }
])