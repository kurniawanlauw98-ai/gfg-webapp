import React from 'react'
import { Link } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

const Landing = () => {
    const { user } = useAuth()

    return (
        <div className="min-h-screen bg-[#0f172a] text-white flex flex-col items-center justify-center p-4">
            <div className="text-center mb-12">
                <h1 className="text-6xl font-black mb-4 bg-clip-text text-transparent bg-gradient-to-r from-blue-400 via-purple-500 to-red-500 animate-gradient-x">
                    GFG Generation for God
                </h1>
                <p className="text-xl text-gray-400 font-light tracking-widest">
                    JOIN THE COMMUNITY • GROW IN FAITH
                </p>
            </div>

            <div className="flex flex-col items-center gap-6 w-full max-w-sm">
                {!user ? (
                    <>
                        <div className="grid grid-cols-2 gap-4 w-full">
                            <Link to="/login" className="px-6 py-4 bg-blue-600 rounded-2xl hover:bg-blue-700 transition font-bold text-center shadow-lg shadow-blue-900/20">
                                Login
                            </Link>
                            <Link to="/register" className="px-6 py-4 bg-red-600 rounded-2xl hover:bg-red-700 transition font-bold text-center shadow-lg shadow-red-900/20">
                                Register
                            </Link>
                        </div>
                        <button
                            onClick={() => {
                                localStorage.setItem('token', 'guest_mode_token');
                                localStorage.setItem('user', JSON.stringify({ name: 'Guest User', role: 'user', email: 'guest@gfg.org' }));
                                window.location.href = '/dashboard';
                            }}
                            className="text-gray-500 hover:text-white transition text-sm font-medium"
                        >
                            Explore as Guest (Demo Mode)
                        </button>
                    </>
                ) : (
                    <div className="flex flex-col gap-4 w-full">
                        <Link to="/dashboard" className="px-8 py-4 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-2xl hover:scale-105 transition-all font-bold text-center shadow-xl">
                            Enter Member Dashboard
                        </Link>
                        {user.role === 'admin' && (
                            <Link to="/admin" className="px-8 py-4 bg-white text-gray-900 rounded-2xl hover:scale-105 transition-all font-bold text-center shadow-xl">
                                🛡️ Open Admin Console
                            </Link>
                        )}
                        <button
                            onClick={() => {
                                localStorage.clear();
                                window.location.reload();
                            }}
                            className="text-red-400 hover:text-red-300 transition text-sm font-medium mt-4"
                        >
                            Not you? Logout
                        </button>
                    </div>
                )}
            </div>

            <div className="absolute bottom-8 text-gray-600 text-xs font-mono uppercase tracking-tighter">
                GFG Platform v2.0 • Empowered by Faith
            </div>
        </div>
    )
}

export default Landing
