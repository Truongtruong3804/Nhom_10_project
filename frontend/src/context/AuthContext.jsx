import { createContext, useContext, useEffect, useMemo, useState } from 'react'

const AuthContext = createContext(null)

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null)

  useEffect(() => {
    const raw = localStorage.getItem('svm_user')
    if (raw) setUser(JSON.parse(raw))
  }, [])

  const login = async (email, password) => {
    // Placeholder: accept any email/password; in real app call auth service
    const u = { id: 'u1', name: email.split('@')[0] || 'User', email, token: 'demo-token' }
    setUser(u)
    localStorage.setItem('svm_user', JSON.stringify(u))
    return u
  }

  const logout = () => {
    setUser(null)
    localStorage.removeItem('svm_user')
  }

  const value = useMemo(() => ({ user, login, logout }), [user])
  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export function useAuth() {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth must be used within AuthProvider')
  return ctx
}

