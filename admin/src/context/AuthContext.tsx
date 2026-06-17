import { createContext, useContext, useEffect, useState, type ReactNode } from 'react'
import api from '../lib/api'

export interface AdminUser {
  id: number
  full_name: string
  email: string
  role: 'user' | 'admin'
}

interface AuthContextValue {
  user: AdminUser | null
  loading: boolean
  login: (email: string, password: string) => Promise<void>
  logout: () => void
}

const AuthContext = createContext<AuthContextValue | null>(null)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user,    setUser]    = useState<AdminUser | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const stored = localStorage.getItem('noria_admin_token')
    if (!stored) { setLoading(false); return }
    api.get<AdminUser>('/auth/me', { headers: { Authorization: `Bearer ${stored}` } })
      .then(({ data }) => {
        if (data.role !== 'admin') {
          localStorage.removeItem('noria_admin_token')
        } else {
          setUser(data)
        }
      })
      .catch(() => localStorage.removeItem('noria_admin_token'))
      .finally(() => setLoading(false))
  }, [])

  const login = async (email: string, password: string) => {
    const { data } = await api.post<{ token: string; user: AdminUser }>('/auth/login', { email, password })
    if (data.user.role !== 'admin') throw new Error('Acceso restringido a administradores')
    localStorage.setItem('noria_admin_token', data.token)
    setUser(data.user)
  }

  const logout = () => {
    localStorage.removeItem('noria_admin_token')
    setUser(null)
  }

  return (
    <AuthContext.Provider value={{ user, loading, login, logout }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth debe usarse dentro de AuthProvider')
  return ctx
}
