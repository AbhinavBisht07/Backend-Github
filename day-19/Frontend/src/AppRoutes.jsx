// Pehla tareeka to create routes :-
import { BrowserRouter, Route, Routes } from "react-router";
import Login from "./features/auth/pages/Login";
import Register from "./features/auth/pages/Register";

const AppRoutes = () => {
    return (
        // <div>AppRoutes</div>
        <BrowserRouter>
            <Routes>
                {/* this first route is dummy route */}
                <Route path="/" element={<h1>Welcome to the App</h1>} />
                 
                <Route path="/login" element={<Login />} />
                <Route path="/register" element={<Register />} />
            </Routes>
        </BrowserRouter>
    )
}

export default AppRoutes




// there is one more method to create routes ... its using createBrowserRouter() method ... we can import this method from react-router ...
// for this method to work we also have to use RouterProvider
// ii created a Home component because we have to have something in the default '/' path ...
// Iske baad App.jsx mein import kara denge humare AppRoutes.jsx ko ..
// and neeche pe run kar denge <AppRoutes/>
// import { createBrowserRouter, RouterProvider } from "react-router";
// import Home from "./components/Home";
// import Login from "./features/auth/pages/Login";
// import Register from "./features/auth/pages/Register";

// const AppRoutes = () => {
//     const allRoutes = createBrowserRouter([
//         {
//             path: '/',
//             element: <Home/>
//         },
//         {
//             path: '/login',
//             element: <Login/>
//         },
//         {
//             path: '/register',
//             element: <Register/>
//         },
//     ])
//   return (
//     // <div>AppRoutes</div>
//     <RouterProvider router={allRoutes}/>
//   )
// }

// export default AppRoutes