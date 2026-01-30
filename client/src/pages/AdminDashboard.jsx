import React, { useState } from 'react'
import Navbar from '../components/Navbar'
import api from '../api'
import toast from 'react-hot-toast'
import { QRCodeCanvas } from 'qrcode.react'

const AdminDashboard = () => {
    const [eventData, setEventData] = useState({ title: '', date: '', location: '', description: '' })
    const [quizData, setQuizData] = useState({ question: '', option1: '', option2: '', option3: '', correctIndex: 0 })
    const [adminEmail, setAdminEmail] = useState('')
    const [events, setEvents] = useState([])
    const [loading, setLoading] = useState(false)
    const [users, setUsers] = useState([])

    const fetchEvents = async () => {
        try {
            const res = await api.get('/api/events')
            setEvents(res.data)
        } catch (error) {
            console.error('Fetch events error:', error)
        }
    }

    const fetchUsers = async () => {
        try {
            const res = await api.get('/api/auth/users')
            setUsers(res.data)
        } catch (error) {
            console.error('Fetch users error:', error)
        }
    }

    React.useEffect(() => {
        fetchEvents()
        fetchUsers()
    }, [])

    const getBirthdaysToday = () => {
        const today = new Date()
        return users.filter(u => {
            if (!u.dob) return false
            const birthDate = new Date(u.dob)
            return today.getDate() === birthDate.getDate() && today.getMonth() === birthDate.getMonth()
        })
    }

    const handleCreateEvent = async (e) => {
        e.preventDefault()
        setLoading(true)
        try {
            await api.post('/api/events', eventData)
            toast.success('Event Created successfully!')
            setEventData({ title: '', date: '', location: '', description: '' })
            fetchEvents() // Refresh list
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

    const handleDeleteEvent = async (id) => {
        if (!window.confirm('Are you sure you want to delete this event?')) return
        try {
            await api.delete(`/api/events/${id}`)
            toast.success('Event deleted')
            fetchEvents()
        } catch (error) {
            toast.error(error.response?.data?.message || 'Failed to delete event')
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

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-12">
                    {/* Birthdays Section */}
                    <div className="lg:col-span-2 bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
                        <div className="p-6 border-b border-gray-50 flex items-center justify-between bg-pink-50/50">
                            <h2 className="text-xl font-bold text-gray-800 flex items-center gap-2">
                                <span className="text-2xl">🎉</span> Birthdays Today
                            </h2>
                            <span className="text-sm font-medium text-pink-600 bg-pink-100 px-3 py-1 rounded-full">
                                {getBirthdaysToday().length} People
                            </span>
                        </div>
                        <div className="p-6">
                            {getBirthdaysToday().length > 0 ? (
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    {getBirthdaysToday().map(u => (
                                        <div key={u.id} className="p-4 bg-gray-50 rounded-xl border border-gray-100 relative overflow-hidden">
                                            <div className="absolute top-0 right-0 p-2 opacity-20 text-3xl">🎈</div>
                                            <h4 className="font-bold text-gray-900 text-lg">{u.name}</h4>
                                            <p className="text-sm text-gray-500 mb-2">{u.email}</p>
                                            <div className="space-y-1">
                                                <p className="text-xs text-gray-600"><strong>Hobby:</strong> {u.hobby || '-'}</p>
                                                <p className="text-xs text-blue-600 italic"><strong>Verse:</strong> {u.favoriteVerse || '-'}</p>
                                            </div>
                                            <button className="mt-4 w-full bg-pink-600 text-white py-2 rounded-lg text-sm font-bold shadow-sm">
                                                Say Happy Birthday!
                                            </button>
                                        </div>
                                    ))}
                                </div>
                            ) : (
                                <div className="text-center py-12 text-gray-400">
                                    <p className="text-4xl mb-2">🎈</p>
                                    <p>No birthdays today.</p>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Quick Stats or something else could go here */}
                    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
                        <div className="p-6 border-b border-gray-50 bg-gray-50/50">
                            <h2 className="text-xl font-bold text-gray-800 flex items-center gap-2">
                                <span className="text-2xl">📊</span> Community Stats
                            </h2>
                        </div>
                        <div className="p-6 space-y-6">
                            <div className="flex items-center justify-between">
                                <span className="text-gray-600">Total Members</span>
                                <span className="font-bold text-2xl text-blue-600">{users.length}</span>
                            </div>
                            <div className="flex items-center justify-between">
                                <span className="text-gray-600">Total Events</span>
                                <span className="font-bold text-2xl text-green-600">{events.length}</span>
                            </div>
                            <div className="p-4 bg-blue-50 rounded-xl text-xs text-blue-700">
                                Tip: You can now manage events and see member birthdays in real-time.
                            </div>
                        </div>
                    </div>
                </div>

                {/* Event List Management */}
                <div className="mt-12 bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
                    <div className="p-6 border-b border-gray-50 bg-gray-50/50">
                        <h2 className="text-xl font-bold text-gray-800 flex items-center gap-2">
                            <span className="text-2xl">📋</span> Current Events Management
                        </h2>
                    </div>
                    <div className="p-6 overflow-x-auto">
                        <table className="w-full text-left">
                            <thead className="bg-gray-50 border-b border-gray-100">
                                <tr>
                                    <th className="px-4 py-3 text-sm font-bold text-gray-600">Event Title</th>
                                    <th className="px-4 py-3 text-sm font-bold text-gray-600">Date</th>
                                    <th className="px-4 py-3 text-sm font-bold text-gray-600">Location</th>
                                    <th className="px-4 py-3 text-sm font-bold text-gray-600 text-right">Action</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-50">
                                {events.length > 0 ? (
                                    events.map(event => (
                                        <tr key={event.id} className="hover:bg-gray-50/50 transition">
                                            <td className="px-4 py-4 font-medium text-gray-800">{event.title}</td>
                                            <td className="px-4 py-4 text-sm text-gray-500">{new Date(event.date).toLocaleDateString()}</td>
                                            <td className="px-4 py-4 text-sm text-gray-500">{event.location}</td>
                                            <td className="px-4 py-4 text-right">
                                                <button
                                                    onClick={() => handleDeleteEvent(event.id)}
                                                    className="bg-red-50 text-red-600 hover:bg-red-600 hover:text-white px-4 py-2 rounded-lg text-sm font-bold transition flex items-center gap-1 ml-auto"
                                                >
                                                    🗑️ <span>Delete</span>
                                                </button>
                                            </td>
                                        </tr>
                                    ))
                                ) : (
                                    <tr>
                                        <td colSpan="4" className="px-4 py-8 text-center text-gray-400">No events found.</td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
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
