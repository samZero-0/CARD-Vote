import { createBrowserRouter } from "react-router-dom";
import Home from "../components/Home";
import Login from "../components/login";
import AuthLayout from "../layout/AuthLayout";
import ProtectedRoute from "./ProtectedRoute";
import PublicRoute from "./PublicRoute";


const router = createBrowserRouter([
    {
        path: "/home",
        element: (
            <ProtectedRoute>
                <Home />
            </ProtectedRoute>
        ),
    },
    {
        path: '/',
        element: <AuthLayout />,
        children: [
            {
                path: '/',
                element: (
                    <PublicRoute>
                        <Login />
                    </PublicRoute>
                )
            },
        ]
    },
    {
        path: '*',
        element: (
            <ProtectedRoute redirectTo="/">
                <Home />
            </ProtectedRoute>
        )
    }
]);

export default router;