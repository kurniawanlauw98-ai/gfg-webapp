import { createContext, useState, useEffect, useContext } from 'react'
import api from '../api'
import { API_URL } from '../config'

const AuthContext = createContext()

export const useAuth = () => useContext(AuthContext)

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null)
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        const verifySession = async () => {
            const token = localStorage.getItem('token')
            if (token) {
                try {
                    // Always verify with server to get latest Role/Points
                    const res = await api.get('/api/auth/me')
                    setUser(res.data)
                    localStorage.setItem('user', JSON.stringify(res.data))
                } catch (err) {
                    console.error("Session verification failed:", err)
                    localStorage.removeItem('user')
                    localStorage.removeItem('token')
                }
            }
            setLoading(false)
        }
        verifySession()
    }, [])

    const login = async (email, password) => {
        const res = await api.post('/api/auth/login', { email, password })
        if (res.data) {
            localStorage.setItem('token', res.data.token)
            localStorage.setItem('user', JSON.stringify(res.data))
            setUser(res.data)
        }
        return res.data
    }

    const register = async (name, email, password, referralCode) => {
        const res = await api.post('/api/auth/register', { name, email, password, referralCode })
        if (res.data) {
            localStorage.setItem('token', res.data.token)
            localStorage.setItem('user', JSON.stringify(res.data))
            setUser(res.data)
        }
        return res.data
    }

    const logout = () => {
        localStorage.removeItem('token')
        localStorage.removeItem('user')
        setUser(null)
    }

    return (
        <AuthContext.Provider value={{ user, loading, login, register, logout }}>
            {!loading && children}
        </AuthContext.Provider>
    )
}
