import React, { useEffect, useState } from 'react'
import axios from 'axios'
import { API_URL } from '../config'

const Leaderboard = () => {
    const [users, setUsers] = useState([])
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        const fetchLeaderboard = async () => {
            try {
                const res = await axios.get(`${API_URL}/api/auth/leaderboard`)
                setUsers(res.data)
            } catch (error) {
                console.error(error)
            } finally {
                setLoading(false)
            }
        }
        fetchLeaderboard()
    }, [])

    if (loading) return <div>Loading...</div>

    return (
        <div className="bg-white rounded-xl shadow-sm p-6">
            <h2 className="text-2xl font-bold mb-6 text-gray-800">Top Members</h2>
            <div className="overflow-x-auto">
                <table className="w-full text-left">
                    <thead>
                        <tr className="border-b border-gray-100 text-gray-500 text-sm">
                            <th className="pb-3 pl-2">Rank</th>
                            <th className="pb-3">User</th>
                            <th className="pb-3 text-right pr-2">Points</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-50">
                        {users.map((user, index) => (
                            <tr key={user._id} className="hover:bg-gray-50 transition">
                                <td className="py-4 pl-2 font-medium text-gray-500">#{index + 1}</td>
                                <td className="py-4 flex items-center gap-3">
                                    <img
                                        src={user.avatar || `https://ui-avatars.com/api/?name=${user.name}&background=random`}
                                        alt=""
                                        className="w-8 h-8 rounded-full"
                                    />
                                    <span className="font-medium text-gray-900">{user.name}</span>
                                </td>
                                <td className="py-4 text-right pr-2 font-bold text-blue-600">{user.points}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    )
}

export default Leaderboard
