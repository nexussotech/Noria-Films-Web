import { useState, type ReactNode } from 'react'
import Sidebar from './Sidebar'
import styles from './AdminLayout.module.css'

export default function AdminLayout({ children }: { children: ReactNode }) {
  const [mobileNavOpen, setMobileNavOpen] = useState(false)

  return (
    <div className={styles.shell}>
      <Sidebar open={mobileNavOpen} onClose={() => setMobileNavOpen(false)} />

      {mobileNavOpen && <div className={styles.overlay} onClick={() => setMobileNavOpen(false)} />}

      <div className={styles.mainCol}>
        <header className={styles.topbar}>
          <button className={styles.menuBtn} onClick={() => setMobileNavOpen(true)} aria-label="Abrir menú">
            ☰
          </button>
          <img src="/assets/images/logo-icon-b.png" alt="NORIA" className={styles.topbarLogo} />
          <span className={styles.topbarBrand}>NORIA Admin</span>
        </header>
        <main className={styles.main}>{children}</main>
      </div>
    </div>
  )
}
