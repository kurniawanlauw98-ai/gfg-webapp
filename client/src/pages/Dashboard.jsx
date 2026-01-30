import React, { useEffect, useState } from 'react'
import { useAuth } from '../context/AuthContext'
import api from '../api'
import toast from 'react-hot-toast'
import { API_URL } from '../config'
import { useNavigate, Routes, Route, Link } from 'react-router-dom'
import Navbar from '../components/Navbar'
import Leaderboard from './Leaderboard'
import Quiz from './Quiz'
import Submissions from './Submissions'
import QRScanner from './QRScanner'

const DashboardHome = () => {
    const { user } = useAuth()
    const [verse, setVerse] = useState(null)
    const [events, setEvents] = useState([])

    useEffect(() => {
        const fetchData = async () => {
            try {
                // Fetch Verse
                const verseRes = await api.get('/api/daily/verse')
                setVerse(verseRes.data)

                // Fetch Events
                const eventRes = await api.get('/api/events')
                // Trust backend filtering, just ensure sorting
                const sortedEvents = eventRes.data.sort((a, b) => new Date(a.date) - new Date(b.date))

                setEvents(sortedEvents)
            } catch (error) {
                console.error("Dashboard Fetch Error:", error)
            }
        }
        fetchData()
    }, [])

    return (
        <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {/* Stats Card */}
                <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                    <h3 className="text-gray-500 text-sm font-medium">Your Points</h3>
                    <p className="text-4xl font-bold text-blue-600 mt-2">{user?.points || 0}</p>
                    <p className="text-xs text-gray-400 mt-1">Keep growing!</p>
                </div>

                {/* Verse Card */}
                <div className="bg-gradient-to-r from-purple-500 to-indigo-600 p-6 rounded-xl shadow-md text-white md:col-span-2">
                    <h3 className="text-xs font-semibold uppercase tracking-wide opacity-80">Verse of the Day</h3>
                    {verse ? (
                        <div className="mt-4">
                            <p className="text-lg font-medium italic">"{verse.verse.text}"</p>
                            <p className="text-sm mt-2 text-right opacity-90">- {verse.verse.reference} ({verse.verse.version})</p>
                        </div>
                    ) : (
                        <p className="mt-4">Loading verse...</p>
                    )}
                </div>
            </div>

            {/* Admin Quick Jump */}
            {user?.role === 'admin' && (
                <div className="bg-blue-50 border border-blue-200 p-6 rounded-2xl flex items-center justify-between shadow-sm">
                    <div>
                        <h3 className="text-blue-900 font-bold text-lg flex items-center gap-2">
                            <span className="text-2xl">🛡️</span> Admin Access
                        </h3>
                        <p className="text-blue-700 text-sm">You are logged in as an administrator.</p>
                    </div>
                    <Link to="/admin" className="px-6 py-2.5 bg-blue-600 text-white rounded-xl font-bold hover:bg-blue-700 transition shadow-md">
                        Open Admin Console
                    </Link>
                </div>
            )}

            {/* Quick Actions */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <Link to="/dashboard/scan" className="p-4 bg-green-50 rounded-xl border border-green-100 hover:bg-green-100 transition flex flex-col items-center justify-center gap-2 text-green-700">
                    <span className="text-2xl">📅</span>
                    <span className="font-medium">Daily Attendance</span>
                </Link>
                <Link to="/dashboard/quiz" className="p-4 bg-yellow-50 rounded-xl border border-yellow-100 hover:bg-yellow-100 transition flex flex-col items-center justify-center gap-2 text-yellow-700">
                    <span className="text-2xl">🧩</span>
                    <span className="font-medium">Daily Quiz</span>
                </Link>
                <Link to="/dashboard/submissions" className="p-4 bg-pink-50 rounded-xl border border-pink-100 hover:bg-pink-100 transition flex flex-col items-center justify-center gap-2 text-pink-700">
                    <span className="text-2xl">🙏</span>
                    <span className="font-medium">Prayers & Ideas</span>
                </Link>
                <Link to="/dashboard/leaderboard" className="p-4 bg-blue-50 rounded-xl border border-blue-100 hover:bg-blue-100 transition flex flex-col items-center justify-center gap-2 text-blue-700">
                    <span className="text-2xl">🏆</span>
                    <span className="font-medium">Leaderboard</span>
                </Link>
            </div>

            {/* Events Section */}
            <div>
                <h3 className="text-lg font-bold mb-4">Upcoming Events</h3>
                {events.length > 0 ? (
                    <div className="space-y-4">
                        {events.map((event) => (
                            <div key={event.id || Math.random()} className="bg-white p-5 rounded-xl shadow-sm border border-gray-100 transition hover:shadow-md">
                                <div className="flex justify-between items-start">
                                    <div>
                                        <h4 className="font-bold text-gray-800 text-lg">{event.title}</h4>
                                        <p className="text-sm text-blue-600 font-medium mt-1">
                                            📅 {new Date(event.date).toLocaleDateString()} • 📍 {event.location}
                                        </p>
                                    </div>
                                    <span className="bg-blue-100 text-blue-700 text-xs px-2 py-1 rounded-lg">Upcoming</span>
                                </div>
                                <p className="text-gray-600 text-sm mt-3 leading-relaxed">
                                    {event.description}
                                </p>
                            </div>
                        ))}
                    </div>
                ) : (
                    <div className="bg-white p-8 rounded-xl shadow-sm border border-gray-100 text-center text-gray-500">
                        <p className="mb-2">📅</p>
                        No upcoming events right now.
                    </div>
                )}
            </div>
        </div>
    )
}

const Dashboard = () => {
    return (
        <div className="min-h-screen bg-gray-50 pb-20">
            <Navbar />
            <main className="max-w-7xl mx-auto px-4 py-8">
                <Routes>
                    <Route path="/" element={<DashboardHome />} />
                    <Route path="/quiz" element={<Quiz />} />
                    <Route path="/submissions" element={<Submissions />} />
                    <Route path="/leaderboard" element={<Leaderboard />} />
                    <Route path="/scan" element={<QRScanner />} />
                </Routes>
            </main>
            <footer className="text-center text-gray-400 text-xs py-4">
                GFG App v2.2 (Latest) • <span className="text-green-500">System Online</span>
            </footer>
        </div>
    )
}

export default Dashboard
