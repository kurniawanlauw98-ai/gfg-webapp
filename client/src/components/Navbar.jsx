import React from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

const Navbar = () => {
    const { user, logout } = useAuth()
    const navigate = useNavigate()

    const handleLogout = () => {
        logout()
        navigate('/login')
    }

    return (
        <nav className="bg-white shadow-sm border-b border-gray-200">
            <div className="max-w-7xl mx-auto px-4">
                <div className="flex justify-between h-16">
                    <div className="flex items-center">
                        <Link to="/dashboard" className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-red-600">
                            GFG
                        </Link>
                        <div className="ml-10 flex space-x-4">
                            <Link to="/dashboard" className="text-gray-700 hover:text-blue-600 px-3 py-2 rounded-md text-sm font-medium">Home</Link>
                            <Link to="/dashboard/events" className="text-gray-700 hover:text-blue-600 px-3 py-2 rounded-md text-sm font-medium">Events</Link>
                            <Link to="/dashboard/about" className="text-gray-700 hover:text-blue-600 px-3 py-2 rounded-md text-sm font-medium">About</Link>
                        </div>
                    </div>
                    <div className="flex items-center space-x-4">
                        <div className="flex flex-col items-end">
                            <span className="text-sm font-medium text-gray-900">{user?.name}</span>
                            <span className="text-xs text-gray-500">{user?.points} pts</span>
                        </div>
                        <img
                            className="h-8 w-8 rounded-full bg-gray-300"
                            src={user?.avatar || `https://ui-avatars.com/api/?name=${user?.name}&background=random`}
                            alt=""
                        />
                        <button
                            onClick={handleLogout}
                            className="text-sm text-red-600 hover:text-red-800 font-medium"
                        >
                            Logout
                        </button>
                    </div>
                </div>
            </div>
        </nav>
    )
}

export default Navbar
