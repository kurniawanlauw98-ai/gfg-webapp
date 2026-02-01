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

            <div className="w-full max-w-5xl mt-24">
                <div className="text-center mb-10">
                    <h2 className="text-3xl font-black mb-2">Share with Community</h2>
                    <p className="text-gray-400">Your voice matters. Inspire others with your journey.</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {[
                        { title: 'Prayer Request', icon: '🙏', color: 'bg-pink-500', type: 'prayer', desc: 'Need support? Let us pray for you.' },
                        { title: 'Testimony', icon: '✨', color: 'bg-blue-500', type: 'testimony', desc: 'Share what God has done in your life.' },
                        { title: 'Idea', icon: '💡', color: 'bg-yellow-500', type: 'idea', desc: 'Have a suggestion for our community?' }
                    ].map((item, i) => (
                        <div key={i} className="bg-[#1e293b] p-8 rounded-3xl border border-gray-800 hover:border-blue-500/50 transition-all group relative overflow-hidden">
                            <div className={`${item.color} w-16 h-16 rounded-2xl flex items-center justify-center text-3xl mb-6 shadow-lg shadow-${item.color.split('-')[1]}-900/40`}>
                                {item.icon}
                            </div>
                            <h3 className="text-xl font-bold mb-3">{item.title}</h3>
                            <p className="text-gray-400 text-sm mb-8 leading-relaxed">{item.desc}</p>

                            <Link
                                to={user ? "/dashboard/submissions" : "/login"}
                                className="inline-flex items-center gap-2 text-white font-bold group-hover:gap-4 transition-all"
                            >
                                Share Now <span className="text-xl">→</span>
                            </Link>

                            <div className={`absolute -right-4 -bottom-4 text-8xl opacity-5 transform rotate-12`}>
                                {item.icon}
                            </div>
                        </div>
                    ))}
                </div>

                <div className="mt-16 text-center">
                    <div className="inline-flex items-center gap-3 px-6 py-3 bg-green-500/10 text-green-400 rounded-full border border-green-500/20 font-bold text-sm">
                        <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></span>
                        Earn +15 Faith Points for every share
                    </div>
                </div>
            </div>

            <div className="mt-32 mb-16 text-gray-600 text-xs font-mono uppercase tracking-widest text-center">
                GFG Platform v2.1 • Empowered by Faith
            </div>
        </div>
    )
}

export default Landing
