import { createContext, useContext, useEffect, useState, type ReactNode } from 'react'
import api from '../lib/api'

export interface AuthUser {
  id: number
  full_name: string
  email: string
  role: 'user' | 'admin'
}

interface RegisterData {
  full_name: string
  email: string
  password: string
  phone?: string
}

interface AuthContextValue {
  user: AuthUser | null
  token: string | null
  loading: boolean
  login: (email: string, password: string) => Promise<void>
  register: (data: RegisterData) => Promise<void>
  logout: () => void
}

const AuthContext = createContext<AuthContextValue | null>(null)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user,    setUser]    = useState<AuthUser | null>(null)
  const [token,   setToken]   = useState<string | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const stored = localStorage.getItem('noria_token')
    if (!stored) { setLoading(false); return }
    api.get<AuthUser>('/auth/me', { headers: { Authorization: `Bearer ${stored}` } })
      .then(({ data }) => { setToken(stored); setUser(data) })
      .catch(() => localStorage.removeItem('noria_token'))
      .finally(() => setLoading(false))
  }, [])

  const login = async (email: string, password: string) => {
    const { data } = await api.post<{ token: string; user: AuthUser }>('/auth/login', { email, password })
    localStorage.setItem('noria_token', data.token)
    setToken(data.token)
    setUser(data.user)
  }

  const register = async (form: RegisterData) => {
    const { data } = await api.post<{ token: string; user: AuthUser }>('/auth/register', form)
    localStorage.setItem('noria_token', data.token)
    setToken(data.token)
    setUser(data.user)
  }

  const logout = () => {
    localStorage.removeItem('noria_token')
    setToken(null)
    setUser(null)
  }

  return (
    <AuthContext.Provider value={{ user, token, loading, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth debe usarse dentro de AuthProvider')
  return ctx
}
