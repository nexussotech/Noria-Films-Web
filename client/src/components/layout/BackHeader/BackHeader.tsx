import { Link } from 'react-router-dom'
import styles from './BackHeader.module.css'

export default function BackHeader() {
  return (
    <header className={styles.header}>
      <div className={styles.inner}>
        <Link to="/" className={styles.logo} aria-label="Ir a la página principal">
          <img src="/assets/images/logo-icon-b.png" alt="NORIA Films" />
        </Link>
      </div>
    </header>
  )
}
