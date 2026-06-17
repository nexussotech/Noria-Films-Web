import type { ReactNode } from 'react'
import Sidebar from './Sidebar'
import styles from './AdminLayout.module.css'

export default function AdminLayout({ children }: { children: ReactNode }) {
  return (
    <div className={styles.shell}>
      <Sidebar />
      <main className={styles.main}>{children}</main>
    </div>
  )
}
