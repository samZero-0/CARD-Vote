import { createBrowserRouter } from "react-router-dom";
import Home from "../components/Home";
import Login from "../components/login";
import AuthLayout from "../layout/AuthLayout";
import ProtectedRoute from "./ProtectedRoute";
import PublicRoute from "./PublicRoute";
import Scorecard from "../components/Scorecard";
import AdminPanel from "../components/AdminPanel";



const router = createBrowserRouter([
    {
        path: "/",
        element: (
           
                <Home />
           
        ),
    },{
        path: '/score',
        element: (
            
                <Scorecard />
            
        )
    },{
        path:"/magic",
        element:(
            <AdminPanel />
        )
    },
    // {
    //     path: '/',
    //     element: <AuthLayout />,
    //     children: [
    //         {
    //             path: '/',
    //             element: (
    //                 <PublicRoute>
    //                     <Login />
    //                 </PublicRoute>
    //             )
    //         },
    //     ]
    // },
    {
        path: '*',
        element: (
            
                <Home />
        )
    }
]);

export default router;