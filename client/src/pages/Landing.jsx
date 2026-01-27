import React from 'react'
import { Link } from 'react-router-dom'

const Landing = () => {
    return (
        <div className="min-h-screen bg-gray-900 text-white flex flex-col items-center justify-center">
            <h1 className="text-5xl font-bold mb-4 bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-red-500">
                GFG Generation for God
            </h1>
            <p className="text-xl mb-8">Join the community. Grow in faith.</p>
            <div className="space-x-4">
                <Link to="/login" className="px-6 py-3 bg-blue-600 rounded-lg hover:bg-blue-700 transition">
                    Login
                </Link>
                <Link to="/register" className="px-6 py-3 bg-red-600 rounded-lg hover:bg-red-700 transition">
                    Register
                </Link>
            </div>
        </div>
    )
}

export default Landing
