import { useEffect, useState, useCallback, Fragment } from 'react'
import { useNavigate } from 'react-router-dom'
import api from '../../lib/api'
import { openWhatsApp } from '../../lib/whatsapp'
import type { QuoteRow } from '../../types'
import styles from './Quotes.module.css'

type StatusFilter = 'all' | 'generated' | 'cancelled' | 'draft'

const STATUS_LABEL: Record<string, string> = {
  draft: 'Borrador', generated: 'Generada', cancelled: 'Cancelada',
}
const STATUS_TABS: { key: StatusFilter; label: string }[] = [
  { key: 'all',       label: 'Todas' },
  { key: 'generated', label: 'Generadas' },
  { key: 'cancelled', label: 'Canceladas' },
  { key: 'draft',     label: 'Borrador' },
]
const DURATION_L: Record<string, string> = { '1_dia': '1 día', '2_dias': '2 días', '3_plus': '3+ días' }
const DELIVERY_L: Record<string, string> = { '3_semanas': '3 sem.', '1_semana': '1 sem.', '2_4_dias': '2-4 días' }

function fmtMXN(v: string | null) {
  if (!v) return '—'
  return new Intl.NumberFormat('es-MX', { style: 'currency', currency: 'MXN', maximumFractionDigits: 0 }).format(Number(v))
}
function fmtDate(iso: string) {
  return new Date(iso).toLocaleDateString('es-MX', { day: 'numeric', month: 'short', year: 'numeric' })
}

export default function Quotes() {
  const [quotes,  setQuotes]  = useState<QuoteRow[]>([])
  const [loading, setLoading] = useState(true)
  const [error,   setError]   = useState('')
  const [filter,  setFilter]  = useState<StatusFilter>('all')
  const [expanded, setExpanded] = useState<number | null>(null)
  const navigate = useNavigate()

  const load = useCallback(async () => {
    setLoading(true)
    setError('')
    try {
      const params = filter !== 'all' ? { status: filter } : {}
      const { data } = await api.get<QuoteRow[]>('/quotes', { params })
      setQuotes(data)
    } catch {
      setError('No se pudieron cargar las cotizaciones')
    } finally {
      setLoading(false)
    }
  }, [filter])

  useEffect(() => { void load() }, [load])

  const changeStatus = async (id: number, status: string) => {
    try {
      await api.patch(`/quotes/${id}/status`, { status })
      setQuotes((prev) => prev.map((q) => q.id === id ? { ...q, status: status as QuoteRow['status'] } : q))
    } catch { /* silently update */ }
  }

  const followUpWhatsApp = (q: QuoteRow) => {
    if (!q.phone) return
    openWhatsApp(
      q.phone,
      `Hola ${q.full_name ?? ''}, te contacto de NORIA Creative Film Studio sobre tu cotización de ${q.service_name ?? 'nuestros servicios'} (#${q.id}).`
    )
  }

  return (
    <div className="admin-page">
      <div className="admin-head">
        <div>
          <h1 className="admin-title">Cotizaciones <span className="count-chip">{quotes.length}</span></h1>
          <p className="admin-sub">Historial de cotizaciones de usuarios</p>
        </div>
      </div>

      <div className="filter-tabs">
        {STATUS_TABS.map((t) => (
          <button key={t.key} className={`filter-tab ${filter === t.key ? 'active' : ''}`} onClick={() => setFilter(t.key)}>
            {t.label}
          </button>
        ))}
      </div>

      {error   && <p className="msg-error">{error}</p>}
      {loading && <p className="msg-loading">Cargando cotizaciones...</p>}

      {!loading && (
        <div className="tbl-wrap">
          <table className="tbl">
            <thead>
              <tr>
                <th>#</th>
                <th>Usuario</th>
                <th>Servicio</th>
                <th>Duración</th>
                <th>Dron</th>
                <th>Entrega</th>
                <th>Total</th>
                <th>Estado</th>
                <th>Fecha</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {quotes.length === 0 ? (
                <tr><td colSpan={10} className="empty-state">Sin cotizaciones en este estado</td></tr>
              ) : quotes.map((q) => (
                <Fragment key={q.id}>
                  <tr className={styles.row} onClick={() => setExpanded(expanded === q.id ? null : q.id)}>
                    <td className={styles.idCell}>
                      <span style={{ color: 'var(--gray)' }}>#{q.id}</span>
                    </td>
                    <td>
                      <div className={styles.nameStack}>
                        <span className={styles.name}>{q.full_name}</span>
                        <span className={styles.sub}>{q.email}</span>
                      </div>
                    </td>
                    <td>{q.service_name}</td>
                    <td>{q.shooting_duration ? (DURATION_L[q.shooting_duration] ?? q.shooting_duration) : '—'}</td>
                    <td>{q.needs_drone ? <span className="badge bd-confirmed">Sí</span> : <span style={{ color: 'var(--gray)' }}>No</span>}</td>
                    <td>{q.delivery_time ? (DELIVERY_L[q.delivery_time] ?? q.delivery_time) : '—'}</td>
                    <td className={styles.total}>{fmtMXN(q.estimated_price)}</td>
                    <td>
                      <span className={`badge bd-${q.status}`}>
                        {STATUS_LABEL[q.status] ?? q.status}
                      </span>
                    </td>
                    <td className={styles.dateCell}>{fmtDate(q.created_at)}</td>
                    <td className={styles.rowActions} onClick={(e) => e.stopPropagation()}>
                      <button className="btn-sm btn-ghost" onClick={() => navigate(`/usuarios/${q.user_id}`)}>
                        Usuario
                      </button>
                      <button
                        className="btn-sm btn-ghost"
                        disabled={!q.phone}
                        title={q.phone ? undefined : 'Cliente sin teléfono registrado'}
                        onClick={() => followUpWhatsApp(q)}
                      >
                        WhatsApp
                      </button>
                    </td>
                  </tr>

                  {/* Expanded row */}
                  {expanded === q.id && (
                    <tr className={styles.expandedRow}>
                      <td colSpan={10}>
                        <div className={styles.expandedContent}>
                          <div className={styles.expandGrid}>
                            <div>
                              <span className={styles.expandLabel}>Cambiar estado</span>
                              <select
                                className="admin-select"
                                value={q.status}
                                onChange={(e) => void changeStatus(q.id, e.target.value)}
                              >
                                <option value="draft">Borrador</option>
                                <option value="generated">Generada</option>
                                <option value="cancelled">Cancelada</option>
                              </select>
                            </div>
                            {q.project_type && (
                              <div>
                                <span className={styles.expandLabel}>Tipo de proyecto</span>
                                <span>{q.project_type}</span>
                              </div>
                            )}
                          </div>
                        </div>
                      </td>
                    </tr>
                  )}
                </Fragment>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}
