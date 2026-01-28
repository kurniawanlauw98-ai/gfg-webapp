import React, { useState } from 'react'
import Navbar from '../components/Navbar'
import api from '../api'
import toast from 'react-hot-toast'
import { QRCodeCanvas } from 'qrcode.react'

const AdminDashboard = () => {
    const [eventData, setEventData] = useState({ title: '', date: '', location: '', description: '' })
    const [quizData, setQuizData] = useState({ question: '', option1: '', option2: '', option3: '', correctIndex: 0 })
    const [adminEmail, setAdminEmail] = useState('')
    const [loading, setLoading] = useState(false)

    const handleCreateEvent = async (e) => {
        e.preventDefault()
        setLoading(true)
        try {
            await api.post('/api/events', eventData)
            toast.success('Event Created successfully!')
            setEventData({ title: '', date: '', location: '', description: '' })
        } catch (error) {
            toast.error(error.response?.data?.message || 'Failed to create event')
        } finally {
            setLoading(false)
        }
    }

    const handleCreateQuiz = async (e) => {
        e.preventDefault()
        setLoading(true)
        try {
            const payload = {
                question: quizData.question,
                options: [quizData.option1, quizData.option2, quizData.option3],
                correctIndex: parseInt(quizData.correctIndex)
            }
            await api.post('/api/daily/quiz', payload)
            toast.success('Daily Quiz Created!')
            setQuizData({ question: '', option1: '', option2: '', option3: '', correctIndex: 0 })
        } catch (error) {
            toast.error(error.response?.data?.message || 'Failed to create quiz')
        } finally {
            setLoading(false)
        }
    }

    const handleAddAdmin = async (e) => {
        e.preventDefault()
        if (!adminEmail) return
        setLoading(true)
        try {
            await api.put('/api/auth/role', { email: adminEmail, role: 'admin' })
            toast.success(`User ${adminEmail} is now an Admin!`)
            setAdminEmail('')
        } catch (error) {
            toast.error(error.response?.data?.message || 'Failed to update user role')
        } finally {
            setLoading(false)
        }
    }

    return (
        <div className="min-h-screen bg-gray-50">
            <Navbar />
            <div className="max-w-7xl mx-auto px-4 py-8">
                <header className="flex items-center justify-between mb-12">
                    <div>
                        <h1 className="text-3xl font-extrabold text-gray-900">Admin Console</h1>
                        <p className="text-gray-500 mt-1">Manage your community content and members.</p>
                    </div>
                </header>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Events Section */}
                    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
                        <div className="p-6 border-b border-gray-50 flex items-center justify-between bg-blue-50/50">
                            <h2 className="text-xl font-bold text-gray-800 flex items-center gap-2">
                                <span className="text-2xl">📅</span> Events
                            </h2>
                            <span className="bg-blue-600 text-white w-8 h-8 rounded-full flex items-center justify-center font-bold shadow-sm">+</span>
                        </div>
                        <div className="p-6">
                            <form onSubmit={handleCreateEvent} className="space-y-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Event Title</label>
                                    <input type="text" placeholder="e.g. Youth Gathering" className="w-full p-2.5 bg-gray-50 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none" value={eventData.title} onChange={e => setEventData({ ...eventData, title: e.target.value })} required />
                                </div>
                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">Date</label>
                                        <input type="date" className="w-full p-2.5 bg-gray-50 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none" value={eventData.date} onChange={e => setEventData({ ...eventData, date: e.target.value })} required />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">Location</label>
                                        <input type="text" placeholder="Hall/Room" className="w-full p-2.5 bg-gray-50 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none" value={eventData.location} onChange={e => setEventData({ ...eventData, location: e.target.value })} required />
                                    </div>
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                                    <textarea placeholder="Tell them about it..." className="w-full p-2.5 bg-gray-50 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none h-24" value={eventData.description} onChange={e => setEventData({ ...eventData, description: e.target.value })} />
                                </div>
                                <button type="submit" disabled={loading} className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-xl font-bold transition shadow-lg shadow-blue-200 flex items-center justify-center gap-2">
                                    {loading ? 'Posting...' : <><span className="text-xl">+</span> Add Event</>}
                                </button>
                            </form>
                        </div>
                    </div>

                    {/* Quiz Section */}
                    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
                        <div className="p-6 border-b border-gray-50 flex items-center justify-between bg-green-50/50">
                            <h2 className="text-xl font-bold text-gray-800 flex items-center gap-2">
                                <span className="text-2xl">🧩</span> Daily Quiz
                            </h2>
                            <span className="bg-green-600 text-white w-8 h-8 rounded-full flex items-center justify-center font-bold shadow-sm">+</span>
                        </div>
                        <div className="p-6">
                            <form onSubmit={handleCreateQuiz} className="space-y-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Question</label>
                                    <input type="text" placeholder="Bible trivia question..." className="w-full p-2.5 bg-gray-50 border border-gray-200 rounded-lg focus:ring-2 focus:ring-green-500 outline-none" value={quizData.question} onChange={e => setQuizData({ ...quizData, question: e.target.value })} required />
                                </div>
                                <div className="space-y-3">
                                    <input type="text" placeholder="Option 1" className="w-full p-2.5 bg-gray-50 border border-gray-200 rounded-lg outline-none" value={quizData.option1} onChange={e => setQuizData({ ...quizData, option1: e.target.value })} required />
                                    <input type="text" placeholder="Option 2" className="w-full p-2.5 bg-gray-50 border border-gray-200 rounded-lg outline-none" value={quizData.option2} onChange={e => setQuizData({ ...quizData, option2: e.target.value })} required />
                                    <input type="text" placeholder="Option 3" className="w-full p-2.5 bg-gray-50 border border-gray-200 rounded-lg outline-none" value={quizData.option3} onChange={e => setQuizData({ ...quizData, option3: e.target.value })} required />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Correct Answer</label>
                                    <select className="w-full p-2.5 bg-gray-50 border border-gray-200 rounded-lg outline-none" value={quizData.correctIndex} onChange={e => setQuizData({ ...quizData, correctIndex: e.target.value })}>
                                        <option value={0}>Option 1 is Correct</option>
                                        <option value={1}>Option 2 is Correct</option>
                                        <option value={2}>Option 3 is Correct</option>
                                    </select>
                                </div>
                                <button type="submit" disabled={loading} className="w-full bg-green-600 hover:bg-green-700 text-white py-3 rounded-xl font-bold transition shadow-lg shadow-green-200 flex items-center justify-center gap-2">
                                    {loading ? 'Posting...' : <><span className="text-xl">+</span> Add Quiz</>}
                                </button>
                            </form>
                        </div>
                    </div>

                    {/* Admin Members Section */}
                    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
                        <div className="p-6 border-b border-gray-50 flex items-center justify-between bg-purple-50/50">
                            <h2 className="text-xl font-bold text-gray-800 flex items-center gap-2">
                                <span className="text-2xl">👤</span> Admin Staff
                            </h2>
                            <span className="bg-purple-600 text-white w-8 h-8 rounded-full flex items-center justify-center font-bold shadow-sm">+</span>
                        </div>
                        <div className="p-6">
                            <p className="text-sm text-gray-500 mb-6">Upgrade a member to Admin status to help manage the community.</p>
                            <form onSubmit={handleAddAdmin} className="space-y-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Member Email</label>
                                    <input
                                        type="email"
                                        placeholder="user@example.com"
                                        className="w-full p-2.5 bg-gray-50 border border-gray-200 rounded-lg focus:ring-2 focus:ring-purple-500 outline-none"
                                        value={adminEmail}
                                        onChange={e => setAdminEmail(e.target.value)}
                                        required
                                    />
                                </div>
                                <div className="p-4 bg-purple-50 rounded-xl text-xs text-purple-700 border border-purple-100 leading-relaxed">
                                    ⚠️ <strong>Warning:</strong> Admins can create events, post quizzes, and manage other members. Be careful who you promote!
                                </div>
                                <button type="submit" disabled={loading} className="w-full bg-purple-600 hover:bg-purple-700 text-white py-3 rounded-xl font-bold transition shadow-lg shadow-purple-200 flex items-center justify-center gap-2">
                                    {loading ? 'Updating...' : <><span className="text-xl">+</span> Add Admin</>}
                                </button>
                            </form>
                        </div>
                    </div>
                </div>

                {/* QR Section - Full Width */}
                <div className="mt-12 bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
                    <div className="p-6 border-b border-gray-50 bg-yellow-50/50">
                        <h2 className="text-xl font-bold text-gray-800 flex items-center gap-2">
                            <span className="text-2xl">⚡</span> Attendance QR Code
                        </h2>
                    </div>
                    <div className="p-8 flex flex-col md:flex-row items-center justify-center gap-12">
                        <div className="bg-white p-6 rounded-2xl shadow-xl border-4 border-yellow-400">
                            <QRCodeCanvas value="GFG_ATTENDANCE_SECRET" size={256} level="H" />
                        </div>
                        <div className="max-w-md text-center md:text-left">
                            <h3 className="text-2xl font-bold text-gray-800 mb-4">Official Attendance QR</h3>
                            <p className="text-gray-600 mb-6 leading-relaxed">
                                Show this barcode during the service or event. Users can scan this using the
                                <strong> "Daily Attendance"</strong> menu on their phones to mark their presence.
                            </p>
                            <div className="flex flex-wrap gap-4 justify-center md:justify-start">
                                <span className="bg-green-100 text-green-700 px-4 py-2 rounded-full font-bold text-sm">
                                    ✓ Verified Token
                                </span>
                                <span className="bg-blue-100 text-blue-700 px-4 py-2 rounded-full font-bold text-sm">
                                    ✓ +10 Points per Scan
                                </span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default AdminDashboard
