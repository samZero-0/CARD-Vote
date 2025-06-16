import { useContext, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { FaGoogle } from "react-icons/fa";
import toast from "react-hot-toast";
import Lottie from "lottie-react";
import { CheckCircle2, AlertCircle } from 'lucide-react';
import LottieLogin from '../assets/login.json'
import { AuthContext } from "../provider/AuthProvider";

const Login = () => {
    const { setUser, signInWithGoogle } = useContext(AuthContext);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState(false);
    const [loading, setLoading] = useState(false);
    const location = useLocation();
    const navigate = useNavigate();

    const handleGoogleSignIn = () => {
        setLoading(true);
        setError('');
        setSuccess(false);

        signInWithGoogle()
            .then(async (result) => {
                const loggedUser = result.user;
                
                // Save user data to database
                const saveUser = {
                    name: loggedUser.displayName,
                    email: loggedUser.email,
                    photo: loggedUser.photoURL,
                    role: "student",
                    uid: loggedUser.uid
                };
    
                try {
                    const response = await fetch('http://localhost:5000/users', {
                        method: 'POST',
                        headers: {
                            'content-type': 'application/json'
                        },
                        body: JSON.stringify(saveUser)
                    });
    
                    if (response.ok) {
                        setUser(loggedUser);
                        setSuccess(true);
                        toast.success('Signed in successfully with Google!');
                        navigate(location?.state ? location.state : "/home");
                    } else {
                        const errorData = await response.json();
                        setError(errorData.message || 'Failed to save user data');
                        toast.error('Failed to save user data');
                    }
                } catch (error) {
                    setError('Error saving user data. Please try again.');
                    toast.error('Error saving user data');
                    console.error('Database save error:', error);
                }
            })
            .catch((error) => {
                setError('Google sign-in failed. Please try again.');
                toast.error('Google sign-in failed');
                console.error('Google sign-in error:', error);
            })
            .finally(() => {
                setLoading(false);
            });
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-white via-gray-50 to-blue-50 flex flex-col md:flex-row items-center justify-center p-6">
            <div className="w-full md:w-1/2 max-w-md transform hover:scale-105 transition-transform duration-500">
                <div className="w-full max-w-sm mx-auto relative">
                    <div className="absolute inset-0 bg-gradient-to-r from-blue-100 to-purple-100 rounded-full filter blur-3xl opacity-30 animate-pulse"></div>
                    <Lottie animationData={LottieLogin} loop={true} />
                </div>
            </div>
            
            <div className="w-full md:w-1/2 max-w-md z-10">
                <div className="bg-white/80 glass backdrop-blur-lg shadow-xl rounded-2xl p-8 w-full transform transition-all duration-300 hover:shadow-2xl">
                    <h2 className="text-4xl font-bold text-center text-gray-800 mb-2">
                        CARD 2025
                    </h2>
                    <h3 className="text-2xl font-semibold text-center text-gray-700 mb-2">
                        3 Minute Thesis Voting
                    </h3>
                    <p className="text-center text-gray-600 mb-8">
                        Sign in with Google to continue your journey
                    </p>
                    
                    <div className="space-y-6">
                        {success && (
                            <div className="flex items-center gap-2 text-green-500 text-sm p-3 bg-green-50 rounded-lg">
                                <CheckCircle2 className="w-5 h-5" />
                                <span>Sign in successful!</span>
                            </div>
                        )}
                        
                        {error && (
                            <div className="flex items-center gap-2 text-red-500 text-sm p-3 bg-red-50 rounded-lg">
                                <AlertCircle className="w-5 h-5" />
                                <span>{error}</span>
                            </div>
                        )}

                        <button
                            type="button"
                            onClick={handleGoogleSignIn}
                            disabled={loading}
                            className="w-full flex items-center justify-center gap-3 px-4 py-4 border-2 border-gray-200 rounded-xl hover:bg-gray-50 transform hover:-translate-y-0.5 transition-all duration-200 focus:ring-2 focus:ring-offset-2 focus:ring-primary focus:outline-none bg-white/50 backdrop-blur-sm disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none shadow-lg hover:shadow-xl"
                        >
                            {loading ? (
                                <>
                                    <div className="w-5 h-5 border-2 border-primary border-t-transparent rounded-full animate-spin"></div>
                                    <span className="text-gray-700 font-medium">Signing in...</span>
                                </>
                            ) : (
                                <>
                                    <FaGoogle className="text-xl text-primary" />
                                    <span className="text-gray-700 font-medium">Continue with Google</span>
                                </>
                            )}
                        </button>

                        <div className="text-center">
                            <p className="text-sm text-gray-500">
                                By signing in, you agree to our{' '}
                                <Link to="/terms" className="text-primary hover:text-primary-dark underline">
                                    Terms of Service
                                </Link>
                                {' '}and{' '}
                                <Link to="/privacy" className="text-primary hover:text-primary-dark underline">
                                    Privacy Policy
                                </Link>
                            </p>
                        </div>
                    </div>
                    
                    <p className="mt-8 text-center text-sm text-gray-600">
                        Need help?{' '}
                        <Link 
                            to="/support" 
                            className="text-primary hover:text-primary-dark font-medium transition-colors"
                        >
                            Contact Support
                        </Link>
                    </p>
                </div>
            </div>
        </div>
    );
};

export default Login;