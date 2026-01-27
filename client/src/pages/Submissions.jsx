import React, { useState } from 'react'
import axios from 'axios'
import toast from 'react-hot-toast'
import { API_URL } from '../config'

const Submissions = () => {
    const [type, setType] = useState('prayer')
    const [content, setContent] = useState('')
    const [loading, setLoading] = useState(false)

    const handleSubmit = async (e) => {
        e.preventDefault()
        if (!content.trim()) return

        setLoading(true)
        try {
            const res = await axios.post(`${API_URL}/api/submissions`, { type, content })
            toast.success(`Submitted successfully! +${res.data.pointsAdded} Points`)
            setContent('')
        } catch (error) {
            toast.error(error.response?.data?.message || 'Submission failed')
        } finally {
            setLoading(false)
        }
    }

    return (
        <div className="bg-white rounded-xl shadow-sm p-6 max-w-2xl mx-auto">
            <h2 className="text-2xl font-bold mb-6 text-gray-800">Share with Community</h2>

            {/* Type Selection */}
            <div className="flex space-x-4 mb-6">
                <button
                    onClick={() => setType('prayer')}
                    className={`flex-1 py-2 rounded-lg font-medium transition ${type === 'prayer' ? 'bg-pink-100 text-pink-700 border-2 border-pink-200' : 'bg-gray-50 text-gray-600 border border-gray-100'}`}
                >
                    Prayer Request
                </button>
                <button
                    onClick={() => setType('testimony')}
                    className={`flex-1 py-2 rounded-lg font-medium transition ${type === 'testimony' ? 'bg-blue-100 text-blue-700 border-2 border-blue-200' : 'bg-gray-50 text-gray-600 border border-gray-100'}`}
                >
                    Testimony
                </button>
                <button
                    onClick={() => setType('idea')}
                    className={`flex-1 py-2 rounded-lg font-medium transition ${type === 'idea' ? 'bg-yellow-100 text-yellow-700 border-2 border-yellow-200' : 'bg-gray-50 text-gray-600 border border-gray-100'}`}
                >
                    Idea
                </button>
            </div>

            <form onSubmit={handleSubmit}>
                <div className="mb-4">
                    <label className="block text-gray-700 font-medium mb-2 capitalize">
                        Write your {type}...
                    </label>
                    <textarea
                        className="w-full h-40 p-4 border rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 bg-gray-50"
                        placeholder={`Share your ${type} here...`}
                        value={content}
                        onChange={(e) => setContent(e.target.value)}
                        required
                    />
                </div>

                <div className="flex items-center justify-between">
                    <span className="text-sm text-green-600 font-medium bg-green-50 px-3 py-1 rounded-full">
                        +15 Points for sharing
                    </span>
                    <button
                        type="submit"
                        disabled={loading}
                        className="px-8 py-3 bg-blue-600 text-white rounded-xl font-bold hover:bg-blue-700 disabled:opacity-50 transition"
                    >
                        {loading ? 'Submitting...' : 'Submit'}
                    </button>
                </div>
            </form>
        </div>
    )
}

export default Submissions
