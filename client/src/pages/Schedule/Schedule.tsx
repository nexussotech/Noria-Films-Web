import { useState, useEffect, useMemo } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import api from '../../lib/api'
import type { QuoteItem, AvailabilitySlot } from '../../types'
import styles from './Schedule.module.css'

type MeetingType = 'presencial' | 'virtual'

interface BookedResult {
  id: number
  appointment_date: string
  start_time: string
  end_time: string
  meeting_type: string
}

function fmtMXN(v: string | number | null) {
  if (!v) return '—'
  return new Intl.NumberFormat('es-MX', { style: 'currency', currency: 'MXN', maximumFractionDigits: 0 }).format(Number(v))
}

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

const DURATION_LABEL: Record<string, string> = {
  '1_dia':  '1 día',
  '2_dias': '2 días',
  '3_plus': '3+ días',
}
const DELIVERY_LABEL: Record<string, string> = {
  '3_semanas': '3 semanas',
  '1_semana':  '1 semana',
  '2_4_dias':  '2-4 días',
}

// ─────────────────────────────────────────────────────────────
export default function Schedule() {
  const { quoteId } = useParams<{ quoteId: string }>()
  const navigate    = useNavigate()

  const [quote,      setQuote]      = useState<QuoteItem | null>(null)
  const [slots,      setSlots]      = useState<AvailabilitySlot[]>([])
  const [selected,   setSelected]   = useState<AvailabilitySlot | null>(null)
  const [meetType,   setMeetType]   = useState<MeetingType>('virtual')
  const [notes,      setNotes]      = useState('')
  const [loading,    setLoading]    = useState(true)
  const [submitting, setSubmitting] = useState(false)
  const [error,      setError]      = useState('')
  const [result,     setResult]     = useState<BookedResult | null>(null)

  useEffect(() => {
    if (!quoteId) return
    setLoading(true)
    Promise.all([
      api.get<QuoteItem>(`/quotes/${quoteId}`),
      api.get<AvailabilitySlot[]>('/appointments/available-slots'),
    ]).then(([qRes, sRes]) => {
      setQuote(qRes.data)
      setSlots(sRes.data)
    }).catch(() => {
      setError('No se pudo cargar la información. Verifica que la cotización existe.')
    }).finally(() => setLoading(false))
  }, [quoteId])

  const slotsByDate = useMemo(() => {
    const map: Record<string, AvailabilitySlot[]> = {}
    slots.forEach((s) => {
      if (!map[s.date]) map[s.date] = []
      map[s.date].push(s)
    })
    return map
  }, [slots])

  const handleBook = async () => {
    if (!selected || !quoteId) return
    setSubmitting(true)
    setError('')
    try {
      const { data } = await api.post<BookedResult>('/appointments', {
        quote_id:     Number(quoteId),
        slot_id:      selected.id,
        meeting_type: meetType,
        notes:        notes || null,
      })
      setResult(data)
    } catch (e: unknown) {
      const msg = (e as { response?: { data?: { message?: string } } })
        ?.response?.data?.message ?? 'Error al agendar la cita'
      setError(msg)
    } finally {
      setSubmitting(false)
    }
  }

  // ── Loading ──────────────────────────────────────────────────
  if (loading) return <div className="page-loading">Cargando disponibilidad...</div>

  // ── Success screen ───────────────────────────────────────────
  if (result) {
    return (
      <div className={styles.page}>
        <div className={styles.inner}>
          <div className={styles.card}>
            <div className={styles.successIcon}>✓</div>
            <h2 className={styles.successTitle}>Cita agendada</h2>
            <p className={styles.successSub}>
              Recibirás un correo de confirmación en tu bandeja de entrada con todos los detalles.
            </p>

            <div className={styles.confirmBox}>
              <div className={styles.confirmRow}>
                <span className={styles.confirmLabel}>Servicio</span>
                <span className={styles.confirmValue}>{quote?.service_name}</span>
              </div>
              <div className={styles.confirmRow}>
                <span className={styles.confirmLabel}>Fecha</span>
                <span className={styles.confirmValue}>{fmtDateLong(result.appointment_date)}</span>
              </div>
              <div className={styles.confirmRow}>
                <span className={styles.confirmLabel}>Hora</span>
                <span className={styles.confirmValue}>
                  {hhmm(result.start_time)} – {hhmm(result.end_time)}
                </span>
              </div>
              <div className={styles.confirmRow}>
                <span className={styles.confirmLabel}>Modalidad</span>
                <span className={styles.confirmValue} style={{ textTransform: 'capitalize' }}>
                  {result.meeting_type}
                </span>
              </div>
              <div className={styles.confirmRow}>
                <span className={styles.confirmLabel}>Total estimado</span>
                <span className={styles.confirmValue}>{fmtMXN(quote?.estimated_price ?? null)}</span>
              </div>
            </div>

            <div className={styles.successActions}>
              <button className={styles.btnPrimary} onClick={() => navigate('/mis-cotizaciones')}>
                Ver mis cotizaciones
              </button>
            </div>
          </div>
        </div>
      </div>
    )
  }

  // ── Error loading ────────────────────────────────────────────
  if (error && !quote) {
    return (
      <div className={styles.page}>
        <div className={styles.inner}>
          <div className={styles.errorBox}>{error}</div>
          <button className={styles.btnSecondary} onClick={() => navigate('/mis-cotizaciones')}>
            ← Volver a mis cotizaciones
          </button>
        </div>
      </div>
    )
  }

  // ── Already scheduled guard ──────────────────────────────────
  if (quote?.status === 'scheduled') {
    return (
      <div className={styles.page}>
        <div className={styles.inner}>
          <div className={styles.card} style={{ textAlign: 'center', padding: '3rem' }}>
            <div className={styles.successIcon}>✓</div>
            <h2 className={styles.successTitle}>Esta cotización ya tiene cita agendada</h2>
            <p style={{ color: 'var(--gray)', margin: '1rem 0 2rem', fontSize: '.88rem' }}>
              La cotización #{quoteId} ya fue agendada. Puedes ver el detalle en tu historial.
            </p>
            <button className={styles.btnPrimary} onClick={() => navigate('/mis-cotizaciones')}>
              Ver mis cotizaciones
            </button>
          </div>
        </div>
      </div>
    )
  }

  // ── Main flow ────────────────────────────────────────────────
  return (
    <div className={styles.page}>
      <div className={styles.inner}>

        {/* Page header */}
        <span className={styles.eyebrow}>NORIA Creative Film Studio · Agendamiento</span>
        <h1 className={styles.title}>Agendar Cita</h1>
        <p className={styles.subtitle}>Cotización #{quoteId} · Selecciona fecha, hora y modalidad</p>

        {/* Quote summary */}
        {quote && (
          <div className={styles.quoteSummary}>
            <span className={styles.quoteIcon}>{quote.service_icon}</span>
            <div className={styles.quoteInfo}>
              <span className={styles.quoteName}>{quote.service_name}</span>
              <span className={styles.quoteMeta}>
                {quote.shooting_duration ? (DURATION_LABEL[quote.shooting_duration] ?? quote.shooting_duration) : ''}
                {quote.shooting_duration && ' · '}
                {quote.needs_drone ? 'Con dron' : 'Sin dron'}
                {quote.delivery_time ? ` · ${DELIVERY_LABEL[quote.delivery_time] ?? quote.delivery_time}` : ''}
              </span>
            </div>
            <span className={styles.quoteTotal}>{fmtMXN(quote.estimated_price)}</span>
          </div>
        )}

        <div className={styles.card}>

          {/* Slot selection */}
          <h2 className={styles.sectionTitle}>1. Selecciona un horario disponible</h2>

          {slots.length === 0 ? (
            <div className={styles.noSlots}>
              <div className={styles.noSlotsIcon}>—</div>
              <p>Sin disponibilidad en este momento</p>
              <p>
                Por el momento no hay horarios disponibles. Intenta más tarde o contacta directamente
                a NORIA Creative Film Studio.
              </p>
            </div>
          ) : (
            <div className={styles.dateGroups}>
              {Object.entries(slotsByDate).map(([date, daySlots]) => (
                <div key={date} className={styles.dateGroup}>
                  <span className={styles.dateLabel}>{fmtDateShort(date)}</span>
                  <div className={styles.slotsRow}>
                    {daySlots.map((s) => (
                      <button
                        key={s.id}
                        type="button"
                        className={`${styles.slotBtn} ${selected?.id === s.id ? styles.slotSelected : ''}`}
                        onClick={() => setSelected(s)}
                      >
                        <span className={styles.slotStart}>{hhmm(s.start_time)}</span>
                        <span className={styles.slotEnd}>hasta {hhmm(s.end_time)}</span>
                      </button>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Meeting type */}
          <h2 className={styles.sectionTitle}>2. Modalidad de reunión</h2>
          <div className={styles.meetRow}>
            <button
              type="button"
              className={`${styles.meetCard} ${meetType === 'virtual' ? styles.meetSelected : ''}`}
              onClick={() => setMeetType('virtual')}
            >
              <span className={styles.meetLabel}>Virtual</span>
              <span className={styles.meetDesc}>Videollamada por Google Meet o Zoom</span>
            </button>
            <button
              type="button"
              className={`${styles.meetCard} ${meetType === 'presencial' ? styles.meetSelected : ''}`}
              onClick={() => setMeetType('presencial')}
            >
              <span className={styles.meetLabel}>Presencial</span>
              <span className={styles.meetDesc}>En las instalaciones del estudio</span>
            </button>
          </div>

          {/* Notes */}
          <h2 className={styles.sectionTitle}>
            3. Notas adicionales{' '}
            <em style={{ fontWeight: 400, textTransform: 'none', letterSpacing: 0, opacity: .6 }}>(opcional)</em>
          </h2>
          <textarea
            className={styles.noteTextarea}
            rows={3}
            placeholder="¿Hay algo que quieras comentar antes de la cita?"
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
          />

          {/* Selected slot preview */}
          {selected && (
            <div className={styles.selectionPreview}>
              <span>Horario seleccionado:</span>
              <strong>{fmtDateLong(selected.date)}, {hhmm(selected.start_time)} – {hhmm(selected.end_time)}</strong>
            </div>
          )}

          {error && <div className={styles.errorBox}>{error}</div>}

          <div className={styles.actions}>
            <button className={styles.btnSecondary} onClick={() => navigate('/mis-cotizaciones')}>
              ← Cancelar
            </button>
            <button
              className={styles.btnPrimary}
              disabled={!selected || submitting}
              onClick={handleBook}
            >
              {submitting ? 'Agendando...' : 'Confirmar cita →'}
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
