import { useEffect, useState, type FormEvent } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'
import styles from '../Login/Login.module.css'

export default function Register() {
  const [form, setForm]     = useState({ full_name: '', email: '', phone: '', password: '', confirm: '' })
  const [error, setError]   = useState('')
  const [loading, setLoading] = useState(false)

  const { register, user } = useAuth()
  const navigate           = useNavigate()

  useEffect(() => {
    if (user) navigate('/mis-cotizaciones', { replace: true })
  }, [user, navigate])

  const change = (e: React.ChangeEvent<HTMLInputElement>) =>
    setForm((p) => ({ ...p, [e.target.name]: e.target.value }))

  const validate = () => {
    if (!form.full_name.trim()) return 'El nombre es requerido'
    if (!form.email.trim() || !/\S+@\S+\.\S+/.test(form.email)) return 'Ingresa un correo válido'
    if (!form.phone.trim()) return 'El teléfono es requerido'
    if (form.password.length < 8) return 'La contraseña debe tener al menos 8 caracteres'
    if (form.password !== form.confirm) return 'Las contraseñas no coinciden'
    return null
  }

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault()
    const validationError = validate()
    if (validationError) { setError(validationError); return }

    setError('')
    setLoading(true)
    try {
      await register({
        full_name: form.full_name,
        email:     form.email,
        password:  form.password,
        phone:     form.phone,
      })
      navigate('/mis-cotizaciones', { replace: true })
    } catch (err: unknown) {
      const data = (err as { response?: { data?: { message?: string; errors?: { msg: string }[] } } })
        ?.response?.data
      const msg = data?.errors?.[0]?.msg ?? data?.message ?? 'No se pudo crear la cuenta. Intenta de nuevo.'
      setError(msg)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className={styles.page}>
      <div className={styles.card}>
        <img src="/assets/images/logo-full-b.png" alt="NORIA Films" className={styles.logo} />
        <h1 className={styles.title}>Crear Cuenta</h1>
        <p className={styles.subtitle}>Regístrate para solicitar cotizaciones</p>

        {error && <div className={styles.error}>{error}</div>}

        <form className={styles.form} onSubmit={handleSubmit} noValidate>
          {([
            { name: 'full_name', label: 'Nombre completo', type: 'text',     placeholder: 'Tu nombre' },
            { name: 'email',     label: 'Correo',          type: 'email',    placeholder: 'tu@email.com' },
            { name: 'phone',     label: 'Teléfono',        type: 'tel',      placeholder: '+52 (449) ...' },
            { name: 'password',  label: 'Contraseña',      type: 'password', placeholder: 'Mínimo 8 caracteres' },
            { name: 'confirm',   label: 'Confirmar',       type: 'password', placeholder: 'Repite la contraseña' },
          ] as const).map((f) => (
            <div key={f.name} className={styles.group}>
              <label htmlFor={f.name}>{f.label}</label>
              <input
                id={f.name}
                name={f.name}
                type={f.type}
                placeholder={f.placeholder}
                required
                value={form[f.name]}
                onChange={change}
                autoComplete={f.name === 'full_name' ? 'name' : f.name}
              />
            </div>
          ))}
          <button type="submit" className={styles.btn} disabled={loading}>
            {loading ? 'Creando cuenta...' : 'Crear Cuenta'}
          </button>
        </form>

        <p className={styles.footer}>
          ¿Ya tienes cuenta? <Link to="/login">Inicia sesión</Link>
        </p>
      </div>
    </div>
  )
}
