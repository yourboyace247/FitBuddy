import { useState } from 'react';
import { FcGoogle } from 'react-icons/fc';
import { useNavigate } from 'react-router-dom';

import { useAuth } from "../../context/AuthContext";

export default function LoginForm({ onSwitchToRegister }) {
    const navigate = useNavigate();
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [rememberMe, setRememberMe] = useState(false);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    
    // eslint-disable-next-line no-unused-vars
    const { login, loginWithGoogle } = useAuth();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        try {
            await login(email, password, rememberMe);
            navigate('/');
        } catch (err) {
            setError(err.message || "Login failed");
        } finally {
            setLoading(false);
        }
    };

    const handleGoogleLogin = () => {
    console.log('Google login clicked');
    alert('Google login will be implemented with Firebase');
    };

    const handleEmailChange = (e) => {
    setEmail(e.target.value);
    };

    const handlePasswordChange = (e) => {
        setPassword(e.target.value);
    }

    const handleRememberMeChange = (e) => {
        setRememberMe(e.target.checked);
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-6">
            {error && (
            <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-md mb-4">
            {error}
            </div>
            )}
            <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                    Email or Username
                </label>
                <input
                id="email"
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm 
             focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500"
                type="text"
                value={email}
                onChange={handleEmailChange}
                placeholder="Email or username"
                required
                />
                {error && error.includes('email or username required') && (
                <div className="text-red-500 text-sm mt-1">{error}</div>
                )}
            </div>
            <div>
                <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">Password</label>
                <input
                id="password"
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm 
             focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500"
                type="password"
                value={password}
                onChange={handlePasswordChange}
                placeholder="Password"
                required
                />
                {error && error.includes('password required') && (
                <div className="text-red-500 text-sm mt-1">{error}</div>
                )}
            </div>
            <div className="flex items-center">
                <input
                id="remember"
                className="h-4 w-4 text-cyan-600 focus:ring-cyan-500 border-gray-300 rounded"
                type="checkbox"
                checked={rememberMe}
                onChange={handleRememberMeChange}
                />
                <label htmlFor="remember" className="ml-2 text-sm text-gray-700">Remember me</label>
            </div>
            <div>
                <button 
                className="w-full bg-cyan-600 hover:bg-cyan-700 text-white font-medium 
             py-2 px-4 rounded-md focus:outline-none focus:ring-2 
             focus:ring-offset-2 focus:ring-cyan-500 disabled:opacity-50"
                type="submit" 
                disabled={loading}>
                    {loading ? "Logging in..." : "Login"}
                </button>
            </div>
            <div className="relative">
                <div className="absolute inset-0 flex items-center">
                    <div className="w-full border-t border-gray-300"></div>
                </div>
                <div className="relative flex justify-center text-sm">
                    <span className="px-2 bg-white text-gray-500">Or continue with</span>
                </div>
            </div>
            <div>
                <button className="w-full flex items-center justify-center gap-2 border 
             border-gray-300 rounded-md px-4 py-2 text-sm font-medium 
             text-gray-700 hover:bg-gray-50"
             onClick={handleGoogleLogin}>
                    <FcGoogle /> Sign in with Google
                </button>
            </div>
            <div className="text-center">
                <button className="text-cyan-600 hover:text-cyan-500 text-sm"
                onClick={onSwitchToRegister}>
                    Don't have an account? Register
                </button>
            </div>
        </form>
    );
}