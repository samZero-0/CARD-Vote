import { createBrowserRouter } from "react-router-dom";
import Home from "../components/Home";
import Login from "../components/login";
import AuthLayout from "../layout/AuthLayout";

const router = createBrowserRouter([
    {
        path: "/home",
        element: <Home />,
       
    },
    {
        path: '/',
        element: <AuthLayout />,
        children: [
            {
                path: 'login',
                element: <Login />
            },
            
        ]
    },
]);
export default router;