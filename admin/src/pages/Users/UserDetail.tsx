import { useEffect, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import api from '../../lib/api'
import type { UserDetailData } from '../../types'
import styles from './UserDetail.module.css'

function fmtMXN(v: string | null) {
  if (!v) return '—'
  return new Intl.NumberFormat('es-MX', { style: 'currency', currency: 'MXN', maximumFractionDigits: 0 }).format(Number(v))
}
function fmtDate(iso: string) {
  return new Date(iso).toLocaleDateString('es-MX', { day: 'numeric', month: 'short', year: 'numeric' })
}

const QUOTE_STATUS: Record<string, string> = {
  draft: 'Borrador', generated: 'Generada', cancelled: 'Cancelada',
}

export default function UserDetail() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const [data,    setData]    = useState<UserDetailData | null>(null)
  const [loading, setLoading] = useState(true)
  const [error,   setError]   = useState('')
  const [toggling, setToggling] = useState(false)

  useEffect(() => {
    if (!id) return
    api.get<UserDetailData>(`/users/${id}`)
      .then(({ data }) => setData(data))
      .catch(() => setError('No se pudo cargar el usuario'))
      .finally(() => setLoading(false))
  }, [id])

  const toggleStatus = async () => {
    if (!data) return
    const newStatus = data.user.status === 'active' ? 'inactive' : 'active'
    setToggling(true)
    try {
      await api.patch(`/users/${id}/status`, { status: newStatus })
      setData((prev) => prev ? { ...prev, user: { ...prev.user, status: newStatus } } : prev)
    } catch {
      // silently fail — user will see no change
    } finally {
      setToggling(false)
    }
  }

  if (loading) return <div className="admin-page"><p className="msg-loading">Cargando usuario...</p></div>
  if (error)   return <div className="admin-page"><p className="msg-error">{error}</p><button className="btn-sm btn-ghost" onClick={() => navigate('/usuarios')}>← Volver</button></div>
  if (!data)   return null

  const { user, quotes } = data

  return (
    <div className="admin-page">
      <button className={styles.back} onClick={() => navigate('/usuarios')}>← Usuarios</button>

      {/* User card */}
      <div className={styles.header}>
        <div className={styles.avatar}>{user.full_name.charAt(0).toUpperCase()}</div>
        <div className={styles.headerInfo}>
          <h1 className={styles.name}>{user.full_name}</h1>
          <p className={styles.email}>{user.email}</p>
          {user.phone && <p className={styles.phone}>{user.phone}</p>}
        </div>
        <div className={styles.headerMeta}>
          <span className={`badge ${user.status === 'active' ? 'bd-active' : 'bd-inactive'}`}>
            {user.status === 'active' ? 'Activo' : 'Inactivo'}
          </span>
          <span className={styles.since}>Registrado {fmtDate(user.created_at)}</span>
          <button
            className={`btn-sm ${user.status === 'active' ? 'btn-danger' : 'btn-ghost'}`}
            onClick={toggleStatus}
            disabled={toggling}
          >
            {toggling ? '...' : user.status === 'active' ? 'Desactivar cuenta' : 'Activar cuenta'}
          </button>
        </div>
      </div>

      {/* Quotes */}
      <section className={styles.section}>
        <h2 className="section-title">Cotizaciones <span className="count-chip">{quotes.length}</span></h2>
        {quotes.length === 0 ? (
          <div className="empty-state">Sin cotizaciones</div>
        ) : (
          <div className="tbl-wrap">
            <table className="tbl">
              <thead>
                <tr>
                  <th>#</th><th>Servicio</th><th>Total estimado</th><th>Estado</th><th>Fecha</th>
                </tr>
              </thead>
              <tbody>
                {quotes.map((q) => (
                  <tr key={q.id}>
                    <td style={{ color: 'var(--gray)', fontSize: '.78rem' }}>{q.id}</td>
                    <td>{q.service ?? q.service_name}</td>
                    <td style={{ fontWeight: 600 }}>{fmtMXN(q.estimated_price)}</td>
                    <td><span className={`badge bd-${q.status}`}>{QUOTE_STATUS[q.status] ?? q.status}</span></td>
                    <td style={{ color: 'var(--gray)', fontSize: '.8rem' }}>{fmtDate(q.created_at)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </section>
    </div>
  )
}
