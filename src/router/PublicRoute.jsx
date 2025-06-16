import { useContext } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { AuthContext } from '../provider/AuthProvider';


const PublicRoute = ({ children, redirectTo = "/home" }) => {
    const { user, loading } = useContext(AuthContext);
    const location = useLocation();

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gray-50">
                <div className="text-center">
                    <div className="w-16 h-16 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
                    <p className="text-gray-600">Loading...</p>
                </div>
            </div>
        );
    }


    if (user) {
        const from = location.state?.from?.pathname || redirectTo;
        return <Navigate to={from} replace />;
    }


    return children;
};

export default PublicRoute;