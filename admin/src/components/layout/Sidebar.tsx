import { NavLink, useNavigate } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'
import styles from './Sidebar.module.css'

const NAV = [
  { to: '/dashboard',     label: 'Dashboard',      icon: '⊞' },
  { to: '/usuarios',      label: 'Usuarios',        icon: '◎' },
  { to: '/servicios',     label: 'Servicios',       icon: '◈' },
  { to: '/cotizaciones',  label: 'Cotizaciones',    icon: '◻' },
  { to: '/citas',         label: 'Citas',           icon: '◷' },
  { to: '/disponibilidad',label: 'Disponibilidad',  icon: '◫' },
  { to: '/mensajes',      label: 'Mensajes',        icon: '◌' },
]

export default function Sidebar() {
  const { user, logout } = useAuth()
  const navigate = useNavigate()

  const handleLogout = () => {
    logout()
    navigate('/login')
  }

  return (
    <aside className={styles.sidebar}>
      <div className={styles.brand}>
        <img src="/assets/images/logo-icon-b.png" alt="NORIA" className={styles.logo} />
        <span className={styles.brandName}>NORIA</span>
        <span className={styles.brandSub}>Admin</span>
      </div>

      <nav className={styles.nav}>
        {NAV.map((item) => (
          <NavLink
            key={item.to}
            to={item.to}
            className={({ isActive }) => `${styles.link} ${isActive ? styles.active : ''}`}
          >
            <span className={styles.icon}>{item.icon}</span>
            <span>{item.label}</span>
          </NavLink>
        ))}
      </nav>

      <div className={styles.footer}>
        <div className={styles.user}>
          <div className={styles.avatar}>{user?.full_name.charAt(0).toUpperCase()}</div>
          <div className={styles.userInfo}>
            <span className={styles.userName}>{user?.full_name.split(' ')[0]}</span>
            <span className={styles.userRole}>Administrador</span>
          </div>
        </div>
        <button className={styles.logoutBtn} onClick={handleLogout} title="Cerrar sesión">
          ⎋
        </button>
      </div>
    </aside>
  )
}
