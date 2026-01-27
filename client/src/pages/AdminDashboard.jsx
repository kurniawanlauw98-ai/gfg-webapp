import React, { useState } from 'react'
import Navbar from '../components/Navbar'
import axios from 'axios'
import toast from 'react-hot-toast'
import { API_URL } from '../config'

const AdminDashboard = () => {
    const [eventData, setEventData] = useState({ title: '', date: '', location: '', description: '' })
    const [quizData, setQuizData] = useState({ question: '', option1: '', option2: '', option3: '', correctIndex: 0 })

    const handleCreateEvent = async (e) => {
        e.preventDefault()
        try {
            await axios.post(`${API_URL}/api/events`, eventData)
            toast.success('Event Created')
            setEventData({ title: '', date: '', location: '', description: '' })
        } catch (error) {
            toast.error('Failed to create event')
        }
    }

    const handleCreateQuiz = async (e) => {
        e.preventDefault()
        try {
            const payload = {
                question: quizData.question,
                options: [quizData.option1, quizData.option2, quizData.option3],
                correctIndex: parseInt(quizData.correctIndex)
            }
            await axios.post(`${API_URL}/api/daily/quiz`, payload)
            toast.success('Quiz Created')
            setQuizData({ question: '', option1: '', option2: '', option3: '', correctIndex: 0 })
        } catch (error) {
            toast.error('Failed to create quiz')
        }
    }

    return (
        <div className="min-h-screen bg-gray-50">
            <Navbar />
            <div className="max-w-7xl mx-auto px-4 py-8">
                <h1 className="text-3xl font-bold mb-8 text-gray-800">Admin Console</h1>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    {/* Create Event */}
                    <div className="bg-white p-6 rounded-xl shadow-sm">
                        <h2 className="text-xl font-bold mb-4">Create Event</h2>
                        <form onSubmit={handleCreateEvent} className="space-y-4">
                            <input type="text" placeholder="Title" className="w-full p-2 border rounded" value={eventData.title} onChange={e => setEventData({ ...eventData, title: e.target.value })} required />
                            <input type="date" className="w-full p-2 border rounded" value={eventData.date} onChange={e => setEventData({ ...eventData, date: e.target.value })} required />
                            <input type="text" placeholder="Location" className="w-full p-2 border rounded" value={eventData.location} onChange={e => setEventData({ ...eventData, location: e.target.value })} required />
                            <textarea placeholder="Description" className="w-full p-2 border rounded" value={eventData.description} onChange={e => setEventData({ ...eventData, description: e.target.value })} />
                            <button type="submit" className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700">Create Event</button>
                        </form>
                    </div>

                    {/* Create Quiz */}
                    <div className="bg-white p-6 rounded-xl shadow-sm">
                        <h2 className="text-xl font-bold mb-4">Create Daily Quiz</h2>
                        <form onSubmit={handleCreateQuiz} className="space-y-4">
                            <input type="text" placeholder="Question" className="w-full p-2 border rounded" value={quizData.question} onChange={e => setQuizData({ ...quizData, question: e.target.value })} required />
                            <input type="text" placeholder="Option 1" className="w-full p-2 border rounded" value={quizData.option1} onChange={e => setQuizData({ ...quizData, option1: e.target.value })} required />
                            <input type="text" placeholder="Option 2" className="w-full p-2 border rounded" value={quizData.option2} onChange={e => setQuizData({ ...quizData, option2: e.target.value })} required />
                            <input type="text" placeholder="Option 3" className="w-full p-2 border rounded" value={quizData.option3} onChange={e => setQuizData({ ...quizData, option3: e.target.value })} required />
                            <select className="w-full p-2 border rounded" value={quizData.correctIndex} onChange={e => setQuizData({ ...quizData, correctIndex: e.target.value })}>
                                <option value={0}>Option 1 Correct</option>
                                <option value={1}>Option 2 Correct</option>
                                <option value={2}>Option 3 Correct</option>
                            </select>
                            <button type="submit" className="w-full bg-green-600 text-white py-2 rounded hover:bg-green-700">Create Quiz</button>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default AdminDashboard
