import React, { useState } from 'react'
import { useNavigate, useLocation, Link } from 'react-router-dom'
import api from '../api'
import toast from 'react-hot-toast'

const ResetPassword = () => {
    const [otp, setOtp] = useState('')
    const [newPassword, setNewPassword] = useState('')
    const [confirmPassword, setConfirmPassword] = useState('')
    const [loading, setLoading] = useState(false)
    const navigate = useNavigate()
    const location = useLocation()
    const emailFromState = location.state?.email || ''

    const handleSubmit = async (e) => {
        e.preventDefault()
        if (newPassword !== confirmPassword) {
            return toast.error('Passwords do not match')
        }
        if (otp.length !== 6) {
            return toast.error('Verification code must be 6 digits')
        }

        setLoading(true)
        try {
            await api.post('/api/auth/reset-password', {
                email: emailFromState,
                otp,
                newPassword
            })
            toast.success('Password reset successful! Please login.')
            navigate('/login')
        } catch (error) {
            toast.error(error.response?.data?.message || 'Failed to reset password')
        } finally {
            setLoading(false)
        }
    }

    return (
        <div className="min-h-screen flex items-center justify-center bg-[#0f172a] p-4">
            <div className="bg-white p-8 rounded-3xl shadow-2xl w-full max-w-md">
                <h2 className="text-3xl font-black mb-2 text-gray-800">Reset Password</h2>
                <p className="text-gray-500 mb-8">Enter the 6-digit code sent to <b>{emailFromState}</b> and your new password.</p>

                <form onSubmit={handleSubmit} className="space-y-6">
                    <div>
                        <label className="block text-sm font-bold text-gray-700 mb-2">Verification Code</label>
                        <input
                            type="text"
                            maxLength="6"
                            className="w-full px-4 py-3 border-2 border-gray-100 rounded-xl font-mono text-center text-2xl tracking-[10px] focus:outline-none focus:border-blue-500 transition-colors"
                            placeholder="000000"
                            value={otp}
                            onChange={(e) => setOtp(e.target.value.replace(/\D/g, ''))}
                            required
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-bold text-gray-700 mb-2">New Password</label>
                        <input
                            type="password"
                            className="w-full px-4 py-3 border-2 border-gray-100 rounded-xl focus:outline-none focus:border-blue-500 transition-colors"
                            placeholder="••••••••"
                            value={newPassword}
                            onChange={(e) => setNewPassword(e.target.value)}
                            required
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-bold text-gray-700 mb-2">Confirm New Password</label>
                        <input
                            type="password"
                            className="w-full px-4 py-3 border-2 border-gray-100 rounded-xl focus:outline-none focus:border-blue-500 transition-colors"
                            placeholder="••••••••"
                            value={confirmPassword}
                            onChange={(e) => setConfirmPassword(e.target.value)}
                            required
                        />
                    </div>

                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full bg-blue-600 text-white py-4 rounded-xl font-bold hover:bg-blue-700 transform hover:scale-[1.02] transition-all disabled:opacity-50 shadow-lg shadow-blue-500/30"
                    >
                        {loading ? 'Resetting...' : 'Reset Password'}
                    </button>
                </form>

                <div className="mt-8 text-center">
                    <Link to="/forgot-password" className="text-gray-500 text-sm hover:underline">
                        Didn't get the code? Send again
                    </Link>
                </div>
            </div>
        </div>
    )
}

export default ResetPassword
