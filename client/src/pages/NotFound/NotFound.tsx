import { useNavigate } from 'react-router-dom'

export default function NotFound() {
  const navigate = useNavigate()

  return (
    <div style={{
      minHeight: '100vh',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      background: 'var(--bg-primary)',
      textAlign: 'center',
      padding: '2rem',
    }}>
      <img src="/assets/images/logo-icon-b.png" alt="" style={{ height: 80, opacity: .3, marginBottom: '2rem' }} />
      <h1 style={{ fontFamily: 'var(--font-heading)', fontSize: 'clamp(4rem,10vw,8rem)', color: 'var(--red)', lineHeight: 1 }}>404</h1>
      <p style={{ color: 'var(--gray)', marginTop: '1rem', marginBottom: '2rem', fontSize: '1.1rem' }}>
        Esta página no existe o fue eliminada.
      </p>
      <button
        onClick={() => navigate('/')}
        style={{
          background: 'var(--red)', color: 'var(--cream)',
          border: 'none', padding: '.85rem 2.4rem',
          borderRadius: '2px', fontSize: '1rem', cursor: 'pointer',
        }}
      >
        Volver al inicio
      </button>
    </div>
  )
}
