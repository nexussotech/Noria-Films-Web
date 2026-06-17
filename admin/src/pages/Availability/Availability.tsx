import { useEffect, useState } from 'react'
import api from '../../lib/api'
import type { AvailSlot, BlockedDate } from '../../types'
import styles from './Availability.module.css'

function fmtDateLong(iso: string) {
  return new Date(iso + 'T00:00:00').toLocaleDateString('es-MX', {
    weekday: 'long', day: 'numeric', month: 'long', year: 'numeric',
  })
}
function fmtDateShort(iso: string) {
  return new Date(iso + 'T00:00:00').toLocaleDateString('es-MX', {
    weekday: 'short', day: 'numeric', month: 'short',
  })
}
function hhmm(t: string) { return String(t).slice(0, 5) }

export default function Availability() {
  const [slots,     setSlots]     = useState<AvailSlot[]>([])
  const [blocked,   setBlocked]   = useState<BlockedDate[]>([])
  const [loading,   setLoading]   = useState(true)
  const [slotForm,  setSlotForm]  = useState({ date: '', start_time: '', end_time: '' })
  const [blockForm, setBlockForm] = useState({ date: '', reason: '' })
  const [slotErr,   setSlotErr]   = useState('')
  const [blockErr,  setBlockErr]  = useState('')
  const [slotOk,    setSlotOk]    = useState('')
  const [blockOk,   setBlockOk]   = useState('')
  const [saving,    setSaving]    = useState(false)
  const [deleteErr, setDeleteErr] = useState('')

  const loadAll = async () => {
    setLoading(true)
    try {
      const [s, b] = await Promise.all([
        api.get<AvailSlot[]>('/admin/availability'),
        api.get<BlockedDate[]>('/admin/blocked-dates'),
      ])
      setSlots(s.data)
      setBlocked(b.data)
    } catch { /* silently */ } finally {
      setLoading(false)
    }
  }

  useEffect(() => { void loadAll() }, [])

  const createSlot = async (e: React.FormEvent) => {
    e.preventDefault()
    setSlotErr(''); setSlotOk('')
    setSaving(true)
    try {
      await api.post('/admin/availability', slotForm)
      setSlotOk('Slot creado correctamente')
      setSlotForm({ date: '', start_time: '', end_time: '' })
      void loadAll()
    } catch (err: unknown) {
      const msg = (err as { response?: { data?: { message?: string } } })?.response?.data?.message ?? 'Error al crear slot'
      setSlotErr(msg)
    } finally { setSaving(false) }
  }

  const deleteSlot = async (id: number) => {
    setDeleteErr('')
    try {
      await api.delete(`/admin/availability/${id}`)
      setSlots((prev) => prev.filter((s) => s.id !== id))
    } catch (err: unknown) {
      const msg = (err as { response?: { data?: { message?: string } } })?.response?.data?.message ?? 'No se pudo eliminar'
      setDeleteErr(msg)
    }
  }

  const createBlock = async (e: React.FormEvent) => {
    e.preventDefault()
    setBlockErr(''); setBlockOk('')
    setSaving(true)
    try {
      await api.post('/admin/blocked-dates', blockForm)
      setBlockOk('Fecha bloqueada')
      setBlockForm({ date: '', reason: '' })
      void loadAll()
    } catch (err: unknown) {
      const msg = (err as { response?: { data?: { message?: string } } })?.response?.data?.message ?? 'Error al bloquear'
      setBlockErr(msg)
    } finally { setSaving(false) }
  }

  const unblock = async (id: number) => {
    try {
      await api.delete(`/admin/blocked-dates/${id}`)
      setBlocked((prev) => prev.filter((b) => b.id !== id))
    } catch { /* silently */ }
  }

  // Group slots by date
  const slotsByDate: Record<string, AvailSlot[]> = {}
  slots.forEach((s) => {
    if (!slotsByDate[s.date]) slotsByDate[s.date] = []
    slotsByDate[s.date].push(s)
  })

  if (loading) return <div className="admin-page"><p className="msg-loading">Cargando disponibilidad...</p></div>

  return (
    <div className="admin-page">
      <div className="admin-head">
        <div>
          <h1 className="admin-title">Disponibilidad</h1>
          <p className="admin-sub">Gestión de horarios y fechas bloqueadas</p>
        </div>
      </div>

      <div className={styles.columns}>

        {/* ── Slots column ── */}
        <div className={styles.col}>
          <div className="section-card">
            <h2 className="section-title">Crear horario disponible</h2>
            {slotErr && <p className="msg-error">{slotErr}</p>}
            {slotOk  && <p className="msg-success">{slotOk}</p>}
            <form onSubmit={createSlot} className={styles.form}>
              <div className={styles.field}>
                <label className={styles.label}>Fecha</label>
                <input type="date" className="admin-input" required
                  value={slotForm.date}
                  onChange={(e) => setSlotForm((p) => ({ ...p, date: e.target.value }))}
                  min={new Date().toISOString().slice(0, 10)}
                />
              </div>
              <div className={styles.row}>
                <div className={styles.field}>
                  <label className={styles.label}>Hora inicio</label>
                  <input type="time" className="admin-input" required
                    value={slotForm.start_time}
                    onChange={(e) => setSlotForm((p) => ({ ...p, start_time: e.target.value }))}
                  />
                </div>
                <div className={styles.field}>
                  <label className={styles.label}>Hora fin</label>
                  <input type="time" className="admin-input" required
                    value={slotForm.end_time}
                    onChange={(e) => setSlotForm((p) => ({ ...p, end_time: e.target.value }))}
                  />
                </div>
              </div>
              <button type="submit" className="btn-sm btn-primary" disabled={saving}>
                {saving ? 'Guardando...' : '+ Crear horario'}
              </button>
            </form>
          </div>

          {/* Slot list */}
          <div className={styles.listCard}>
            <h2 className="section-title">
              Horarios registrados <span className="count-chip">{slots.length}</span>
            </h2>
            {deleteErr && <p className="msg-error">{deleteErr}</p>}
            {slots.length === 0 ? (
              <p style={{ color: 'var(--gray)', fontSize: '.84rem' }}>No hay horarios registrados.</p>
            ) : (
              Object.entries(slotsByDate).map(([date, daySlots]) => (
                <div key={date} className={styles.dateGroup}>
                  <div className={styles.dateHeader}>{fmtDateShort(date)}</div>
                  {daySlots.map((s) => (
                    <div key={s.id} className={`${styles.slotRow} ${!s.is_available ? styles.taken : ''}`}>
                      <span className={styles.slotTime}>
                        {hhmm(s.start_time)} – {hhmm(s.end_time)}
                      </span>
                      <span className={`badge ${s.is_available ? 'bd-active' : 'bd-cancelled'}`}>
                        {s.is_available ? 'Disponible' : 'Ocupado'}
                      </span>
                      {s.is_available ? (
                        <button className="btn-sm btn-danger" onClick={() => void deleteSlot(s.id)}>
                          Eliminar
                        </button>
                      ) : (
                        <span style={{ fontSize: '.72rem', color: 'var(--gray)' }}>Tiene cita</span>
                      )}
                    </div>
                  ))}
                </div>
              ))
            )}
          </div>
        </div>

        {/* ── Blocked dates column ── */}
        <div className={styles.col}>
          <div className="section-card">
            <h2 className="section-title">Bloquear fecha</h2>
            {blockErr && <p className="msg-error">{blockErr}</p>}
            {blockOk  && <p className="msg-success">{blockOk}</p>}
            <form onSubmit={createBlock} className={styles.form}>
              <div className={styles.field}>
                <label className={styles.label}>Fecha a bloquear</label>
                <input type="date" className="admin-input" required
                  value={blockForm.date}
                  onChange={(e) => setBlockForm((p) => ({ ...p, date: e.target.value }))}
                />
              </div>
              <div className={styles.field}>
                <label className={styles.label}>Motivo <em style={{ fontWeight: 400, opacity: .6 }}>(opcional)</em></label>
                <input type="text" className="admin-input" placeholder="ej. Día festivo, vacaciones..."
                  value={blockForm.reason}
                  onChange={(e) => setBlockForm((p) => ({ ...p, reason: e.target.value }))}
                />
              </div>
              <button type="submit" className="btn-sm btn-danger" disabled={saving}>
                {saving ? 'Bloqueando...' : '⊘ Bloquear fecha'}
              </button>
            </form>
          </div>

          {/* Blocked list */}
          <div className={styles.listCard}>
            <h2 className="section-title">
              Fechas bloqueadas <span className="count-chip">{blocked.length}</span>
            </h2>
            {blocked.length === 0 ? (
              <p style={{ color: 'var(--gray)', fontSize: '.84rem' }}>Sin fechas bloqueadas.</p>
            ) : (
              blocked.map((b) => (
                <div key={b.id} className={styles.blockedRow}>
                  <div className={styles.blockedInfo}>
                    <span className={styles.blockedDate}>{fmtDateLong(b.date)}</span>
                    {b.reason && <span className={styles.blockedReason}>{b.reason}</span>}
                  </div>
                  <button className="btn-sm btn-ghost" onClick={() => void unblock(b.id)}>
                    Desbloquear
                  </button>
                </div>
              ))
            )}
          </div>
        </div>

      </div>
    </div>
  )
}
