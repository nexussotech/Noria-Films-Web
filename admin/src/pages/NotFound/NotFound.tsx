import { useNavigate } from 'react-router-dom'

export default function NotFound() {
  const navigate = useNavigate()

  return (
    <div className="admin-page" style={{
      minHeight: '60vh',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      textAlign: 'center',
    }}>
      <h1 style={{ fontSize: '4.5rem', color: 'var(--red, #A73436)', lineHeight: 1, margin: 0 }}>404</h1>
      <p style={{ color: 'var(--gray)', margin: '1rem 0 1.5rem', fontSize: '1rem' }}>
        Esta página no existe dentro del panel de administración.
      </p>
      <button className="btn-sm btn-primary" onClick={() => navigate('/dashboard')}>
        Volver al dashboard
      </button>
    </div>
  )
}
