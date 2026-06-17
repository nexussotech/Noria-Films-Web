import { Navigate } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'

export default function ProtectedAdminRoute({ children }: { children: React.ReactNode }) {
  const { user, loading } = useAuth()

  if (loading) {
    return (
      <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <span style={{ color: 'var(--gray)', fontSize: '.9rem' }}>Verificando acceso...</span>
      </div>
    )
  }

  if (!user || user.role !== 'admin') return <Navigate to="/login" replace />
  return <>{children}</>
}
