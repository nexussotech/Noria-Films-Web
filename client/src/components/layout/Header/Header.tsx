import { useState, useEffect, useRef } from 'react'
import { useNavigate, useLocation, NavLink } from 'react-router-dom'
import { useAuth } from '../../../context/AuthContext'
import styles from './Header.module.css'

const NAV_ITEMS = [
  { label: 'Inicio',     anchor: 'inicio' },
  { label: 'Nosotros',   anchor: 'nosotros' },
  { label: 'Servicios',  anchor: 'servicios' },
  { label: 'Portafolio', anchor: 'portafolio' },
  { label: 'Talento',    anchor: 'talento' },
  { label: 'Contacto',   anchor: 'contacto' },
]

export default function Header() {
  const [scrolled,  setScrolled]  = useState(false)
  const [menuOpen,  setMenuOpen]  = useState(false)
  const [dropOpen,  setDropOpen]  = useState(false)
  const dropRef = useRef<HTMLDivElement>(null)

  const navigate  = useNavigate()
  const location  = useLocation()
  const { user, logout } = useAuth()

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 50)
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  useEffect(() => { setMenuOpen(false) }, [location])

  // Cerrar dropdown al hacer click fuera
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (dropRef.current && !dropRef.current.contains(e.target as Node)) setDropOpen(false)
    }
    document.addEventListener('mousedown', handler)
    return () => document.removeEventListener('mousedown', handler)
  }, [])

  const scrollTo = (anchor: string) => {
    setMenuOpen(false)
    if (location.pathname !== '/') {
      navigate('/')
      setTimeout(() => document.getElementById(anchor)?.scrollIntoView({ behavior: 'smooth' }), 100)
    } else {
      document.getElementById(anchor)?.scrollIntoView({ behavior: 'smooth' })
    }
  }

  const handleLogout = () => {
    setDropOpen(false)
    logout()
    navigate('/')
  }

  return (
    <header className={`${styles.header} ${scrolled ? styles.scrolled : ''}`}>
      <div className={styles.inner}>
        <button className={styles.logo} onClick={() => scrollTo('inicio')} aria-label="Ir al inicio">
          <img src="/assets/images/logo-icon-b.png" alt="NORIA Films" />
        </button>

        <nav className={styles.navDesktop}>
          {NAV_ITEMS.map((item) => (
            <button key={item.anchor} onClick={() => scrollTo(item.anchor)}>
              {item.label}
            </button>
          ))}

          {user ? (
            <div className={styles.userMenu} ref={dropRef}>
              <button className={styles.userBtn} onClick={() => setDropOpen((v) => !v)}>
                <span className={styles.userInitial}>{user.full_name.charAt(0).toUpperCase()}</span>
                <span className={styles.userName}>{user.full_name.split(' ')[0]}</span>
                <span className={styles.chevron}>{dropOpen ? '▲' : '▼'}</span>
              </button>
              {dropOpen && (
                <div className={styles.dropdown}>
                  <NavLink
                    to="/cotizacion"
                    className={({ isActive }) => `${styles.navLink} ${isActive ? styles.navLinkActive : ''}`}
                    onClick={() => setDropOpen(false)}
                  >
                    Nueva Cotización
                  </NavLink>
                  <NavLink
                    to="/mis-cotizaciones"
                    className={({ isActive }) => `${styles.navLink} ${isActive ? styles.navLinkActive : ''}`}
                    onClick={() => setDropOpen(false)}
                  >
                    Mis Cotizaciones
                  </NavLink>
                  <div className={styles.divider} />
                  <button className={styles.logoutBtn} onClick={handleLogout}>
                    Cerrar Sesión
                  </button>
                </div>
              )}
            </div>
          ) : (
            <button className={styles.cta} onClick={() => navigate('/login')}>
              Mi Cuenta
            </button>
          )}
        </nav>

        <button
          className={`${styles.hamburger} ${menuOpen ? styles.open : ''}`}
          onClick={() => setMenuOpen((v) => !v)}
          aria-label="Menú"
        >
          <span /><span /><span />
        </button>
      </div>

      <nav className={`${styles.navMobile} ${menuOpen ? styles.open : ''}`}>
        {NAV_ITEMS.map((item) => (
          <button key={item.anchor} onClick={() => scrollTo(item.anchor)}>
            {item.label}
          </button>
        ))}
        {user ? (
          <>
            <button onClick={() => { setMenuOpen(false); navigate('/cotizacion') }}>Nueva Cotización</button>
            <button onClick={() => { setMenuOpen(false); navigate('/mis-cotizaciones') }}>Mis Cotizaciones</button>
            <button onClick={handleLogout} style={{ color: 'var(--red-light)' }}>Cerrar Sesión</button>
          </>
        ) : (
          <button onClick={() => navigate('/login')}>Mi Cuenta</button>
        )}
      </nav>
    </header>
  )
}
