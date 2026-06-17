import { useEffect, useState, useCallback } from 'react'
import api from '../../lib/api'
import type { ApptRow } from '../../types'
import styles from './Appointments.module.css'

type StatusFilter = 'all' | 'pending' | 'confirmed' | 'cancelled' | 'completed'

const STATUS_LABEL: Record<string, string> = {
  pending: 'Pendiente', confirmed: 'Confirmada', cancelled: 'Cancelada', completed: 'Completada',
}
const STATUS_TABS: { key: StatusFilter; label: string }[] = [
  { key: 'all',       label: 'Todas' },
  { key: 'pending',   label: 'Pendientes' },
  { key: 'confirmed', label: 'Confirmadas' },
  { key: 'completed', label: 'Completadas' },
  { key: 'cancelled', label: 'Canceladas' },
]

function fmtDate(iso: string) {
  return new Date(String(iso).slice(0, 10) + 'T00:00:00').toLocaleDateString('es-MX', {
    weekday: 'short', day: 'numeric', month: 'short', year: 'numeric',
  })
}
function fmtMXN(v: string | null | undefined) {
  if (!v) return '—'
  return new Intl.NumberFormat('es-MX', { style: 'currency', currency: 'MXN', maximumFractionDigits: 0 }).format(Number(v))
}

export default function Appointments() {
  const [appts,   setAppts]   = useState<ApptRow[]>([])
  const [loading, setLoading] = useState(true)
  const [error,   setError]   = useState('')
  const [filter,  setFilter]  = useState<StatusFilter>('all')
  const [changing, setChanging] = useState<number | null>(null)

  const load = useCallback(async () => {
    setLoading(true)
    setError('')
    try {
      const params = filter !== 'all' ? { status: filter } : {}
      const { data } = await api.get<ApptRow[]>('/appointments', { params })
      setAppts(data)
    } catch {
      setError('No se pudieron cargar las citas')
    } finally {
      setLoading(false)
    }
  }, [filter])

  useEffect(() => { void load() }, [load])

  const changeStatus = async (id: number, status: string) => {
    setChanging(id)
    try {
      await api.patch(`/appointments/${id}/status`, { status })
      setAppts((prev) => prev.map((a) => a.id === id ? { ...a, status: status as ApptRow['status'] } : a))
    } catch { /* silently */ } finally {
      setChanging(null)
    }
  }

  return (
    <div className="admin-page">
      <div className="admin-head">
        <div>
          <h1 className="admin-title">Citas <span className="count-chip">{appts.length}</span></h1>
          <p className="admin-sub">Gestión de citas agendadas</p>
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
      {loading && <p className="msg-loading">Cargando citas...</p>}

      {!loading && (
        <div className="tbl-wrap">
          <table className="tbl">
            <thead>
              <tr>
                <th>#</th>
                <th>Cliente</th>
                <th>Servicio</th>
                <th>Fecha</th>
                <th>Hora</th>
                <th>Modalidad</th>
                <th>Estimado</th>
                <th>Estado</th>
                <th>Cambiar estado</th>
              </tr>
            </thead>
            <tbody>
              {appts.length === 0 ? (
                <tr><td colSpan={9} className="empty-state">Sin citas en este estado</td></tr>
              ) : appts.map((a) => (
                <tr key={a.id}>
                  <td className={styles.idCell}>{a.id}</td>
                  <td>
                    <div className={styles.nameStack}>
                      <span className={styles.name}>{a.full_name}</span>
                      <span className={styles.sub}>{a.email}</span>
                    </div>
                  </td>
                  <td>{a.service_name}</td>
                  <td className={styles.dateCell}>{fmtDate(a.appointment_date)}</td>
                  <td style={{ fontFamily: 'monospace', fontSize: '.82rem' }}>
                    {String(a.start_time).slice(0, 5)} – {String(a.end_time).slice(0, 5)}
                  </td>
                  <td>
                    <span className={`badge ${a.meeting_type === 'presencial' ? 'bd-generated' : 'bd-draft'}`}>
                      {a.meeting_type}
                    </span>
                  </td>
                  <td style={{ fontWeight: 600 }}>{fmtMXN(a.estimated_price)}</td>
                  <td>
                    <span className={`badge bd-${a.status}`}>
                      {STATUS_LABEL[a.status] ?? a.status}
                    </span>
                  </td>
                  <td>
                    <select
                      className="admin-select"
                      value={a.status}
                      disabled={changing === a.id}
                      onChange={(e) => void changeStatus(a.id, e.target.value)}
                    >
                      <option value="pending">Pendiente</option>
                      <option value="confirmed">Confirmada</option>
                      <option value="completed">Completada</option>
                      <option value="cancelled">Cancelada</option>
                    </select>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {!loading && appts.some((a) => a.notes) && (
        <div className={styles.notes}>
          <h3 className="section-title" style={{ marginTop: '2rem' }}>Notas de citas</h3>
          {appts.filter((a) => a.notes).map((a) => (
            <div key={a.id} className={styles.noteCard}>
              <span className={styles.noteId}>Cita #{a.id}</span>
              <span className={styles.noteName}>{a.full_name}</span>
              <p className={styles.noteText}>{a.notes}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
