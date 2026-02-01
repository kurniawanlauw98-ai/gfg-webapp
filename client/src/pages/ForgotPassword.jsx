import React, { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import api from '../api'
import toast from 'react-hot-toast'

const ForgotPassword = () => {
    const [email, setEmail] = useState('')
    const [loading, setLoading] = useState(false)
    const navigate = useNavigate()

    const handleSubmit = async (e) => {
        e.preventDefault()
        setLoading(true)
        try {
            await api.post('/api/auth/forgot-password', { email })
            toast.success('Verification code sent to your email!')
            navigate('/reset-password', { state: { email } })
        } catch (error) {
            toast.error(error.response?.data?.message || 'Failed to send reset code')
        } finally {
            setLoading(false)
        }
    }

    return (
        <div className="min-h-screen flex items-center justify-center bg-[#0f172a] p-4">
            <div className="bg-white p-8 rounded-3xl shadow-2xl w-full max-w-md">
                <h2 className="text-3xl font-black mb-2 text-gray-800">Forgot Password?</h2>
                <p className="text-gray-500 mb-8">Enter your email and we'll send you a 6-digit code to reset your password.</p>

                <form onSubmit={handleSubmit} className="space-y-6">
                    <div>
                        <label className="block text-sm font-bold text-gray-700 mb-2">Email Address</label>
                        <input
                            type="email"
                            className="w-full px-4 py-3 border-2 border-gray-100 rounded-xl focus:outline-none focus:border-blue-500 transition-colors"
                            placeholder="your@email.com"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                        />
                    </div>

                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full bg-blue-600 text-white py-4 rounded-xl font-bold hover:bg-blue-700 transform hover:scale-[1.02] transition-all disabled:opacity-50 shadow-lg shadow-blue-500/30"
                    >
                        {loading ? 'Sending...' : 'Send Reset Code'}
                    </button>
                </form>

                <div className="mt-8 text-center">
                    <Link to="/login" className="text-blue-600 font-bold hover:underline">
                        Back to Login
                    </Link>
                </div>
            </div>
        </div>
    )
}

export default ForgotPassword
