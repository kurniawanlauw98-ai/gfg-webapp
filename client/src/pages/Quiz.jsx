import React, { useEffect, useState } from 'react'
import axios from 'axios'
import toast from 'react-hot-toast'
import { useAuth } from '../context/AuthContext'
import { API_URL } from '../config'

const Quiz = () => {
    const [quiz, setQuiz] = useState(null)
    const [loading, setLoading] = useState(true)
    const [submitted, setSubmitted] = useState(false)
    const [selectedOption, setSelectedOption] = useState(null)
    const { user } = useAuth()

    useEffect(() => {
        const fetchQuiz = async () => {
            try {
                const res = await axios.get(`${API_URL}/api/daily/quiz`)
                setQuiz(res.data.quiz)
            } catch (error) {
                // If 404, just null
            } finally {
                setLoading(false)
            }
        }
        fetchQuiz()
    }, [])

    const handleSubmit = async () => {
        if (selectedOption === null) return
        try {
            const res = await axios.post(`${API_URL}/api/daily/quiz/submit`, { answerIndex: selectedOption })
            if (res.data.correct) {
                toast.success(`Correct! +${res.data.pointsAdded} Points`)
            } else {
                toast.error('Incorrect. Try again tomorrow!')
            }
            setSubmitted(true)
        } catch (error) {
            toast.error(error.response?.data?.message || 'Error submitting quiz')
        }
    }

    if (loading) return <div>Loading Quiz...</div>
    if (!quiz) return <div className="text-center py-10">No quiz available for today. Check back later!</div>

    return (
        <div className="bg-white rounded-xl shadow-sm p-6 max-w-2xl mx-auto">
            <h2 className="text-2xl font-bold mb-6 text-gray-800">Daily Bible Quiz</h2>
            <div className="mb-8">
                <p className="text-lg font-medium text-gray-700">{quiz.question}</p>
            </div>

            <div className="space-y-4 mb-8">
                {quiz.options.map((option, index) => (
                    <button
                        key={index}
                        onClick={() => setSelectedOption(index)}
                        disabled={submitted}
                        className={`w-full text-left p-4 rounded-lg border-2 transition ${selectedOption === index
                            ? 'border-blue-500 bg-blue-50 text-blue-700'
                            : 'border-gray-100 hover:border-gray-200'
                            }`}
                    >
                        {option}
                    </button>
                ))}
            </div>

            {!submitted ? (
                <button
                    onClick={handleSubmit}
                    disabled={selectedOption === null}
                    className="w-full bg-blue-600 text-white py-3 rounded-xl font-bold hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition"
                >
                    Submit Answer
                </button>
            ) : (
                <div className="text-center p-4 bg-gray-50 rounded-lg">
                    You have submitted your answer.
                </div>
            )}
        </div>
    )
}

export default Quiz
