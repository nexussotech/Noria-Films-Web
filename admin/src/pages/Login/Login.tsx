import { useEffect, useState, type FormEvent } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'
import styles from './Login.module.css'

export default function AdminLogin() {
  const [email,    setEmail]    = useState('')
  const [password, setPassword] = useState('')
  const [error,    setError]    = useState('')
  const [loading,  setLoading]  = useState(false)

  const { login, user } = useAuth()
  const navigate        = useNavigate()

  useEffect(() => {
    if (user) navigate('/dashboard', { replace: true })
  }, [user, navigate])

  const validate = () => {
    if (!email.trim() || !/\S+@\S+\.\S+/.test(email)) return 'Ingresa un correo válido'
    if (!password) return 'La contraseña es requerida'
    return null
  }

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault()
    const err = validate()
    if (err) { setError(err); return }
    setError('')
    setLoading(true)
    try {
      await login(email, password)
      navigate('/dashboard', { replace: true })
    } catch (e: unknown) {
      const msg = (e as Error).message.includes('administrador')
        ? 'Esta cuenta no tiene permisos de administrador'
        : (e as { response?: { data?: { message?: string } } })?.response?.data?.message ?? 'Credenciales inválidas'
      setError(msg)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className={styles.page}>
      <div className={styles.card}>
        <div className={styles.brand}>
          <img src="/assets/images/logo-icon-b.png" alt="NORIA" className={styles.logo} />
          <div>
            <p className={styles.brandName}>NORIA Films</p>
            <p className={styles.brandSub}>Panel de Administración</p>
          </div>
        </div>

        <h1 className={styles.title}>Acceso Admin</h1>

        {error && <div className={styles.error}>{error}</div>}

        <form className={styles.form} onSubmit={handleSubmit} noValidate>
          <div className={styles.group}>
            <label htmlFor="email">Correo</label>
            <input
              id="email"
              type="email"
              placeholder="admin@noriafilms.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              autoComplete="email"
            />
          </div>
          <div className={styles.group}>
            <label htmlFor="password">Contraseña</label>
            <input
              id="password"
              type="password"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              autoComplete="current-password"
            />
          </div>
          <button type="submit" className={styles.btn} disabled={loading}>
            {loading ? 'Verificando...' : 'Entrar al Panel'}
          </button>
        </form>

        <p className={styles.note}>Acceso restringido — solo administradores autorizados</p>
      </div>
    </div>
  )
}
