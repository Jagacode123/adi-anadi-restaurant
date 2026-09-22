import { createContext, useContext, useState, useCallback } from 'react'

const AuthContext = createContext(null)

export function AuthProvider({ children }) {
  const [token, setToken] = useState(() => {
    try {
      return localStorage.getItem('token') || null
    } catch {
      return null
    }
  })

  const [user, setUser] = useState(() => {
    try {
      const storedUser = localStorage.getItem('user')
      return storedUser ? JSON.parse(storedUser) : null
    } catch {
      return null
    }
  })

  const login = useCallback((newToken, newUser) => {
    setToken(newToken)
    setUser(newUser)
    try {
      localStorage.setItem('token', newToken)
      localStorage.setItem('user', JSON.stringify(newUser))
    } catch {
      // storage error
    }
  }, [])

  const logout = useCallback(() => {
    setToken(null)
    setUser(null)
    try {
      localStorage.removeItem('token')
      localStorage.removeItem('user')
    } catch {
      // storage error
    }
  }, [])

  const value = {
    user,
    token,
    isAuthenticated: !!token,
    role: user?.role || null,
    isAdmin: user?.role === 'ADMIN',
    isCustomer: user?.role === 'CUSTOMER',
    login,
    logout,
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export function useAuth() {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth must be used inside AuthProvider')
  return ctx
}
