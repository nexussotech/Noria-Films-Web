import { useNavigate } from 'react-router-dom'
import { CalendarCheck } from 'lucide-react'
import { useQuotes } from '../../hooks/useQuotes'
import BackHeader from '../../components/layout/BackHeader/BackHeader'
import styles from './MyQuotes.module.css'

const STATUS_LABEL: Record<string, string> = {
  draft:     'Borrador',
  generated: 'Generada',
  scheduled: 'Con cita agendada',
  cancelled: 'Cancelada',
}
const STATUS_CSS: Record<string, string> = {
  draft:     styles.draft,
  generated: styles.generated,
  scheduled: styles.scheduled,
  cancelled: styles.cancelled,
}
const CARD_STATUS_CSS: Record<string, string> = {
  generated: styles.statusGenerated,
  scheduled: styles.statusScheduled,
  cancelled: styles.statusCancelled,
}

const DURATION_LABEL: Record<string, string> = {
  '1_dia':   '1 día',
  '2_dias':  '2 días',
  '3_plus':  '3+ días',
}
const DELIVERY_LABEL: Record<string, string> = {
  '3_semanas': '3 semanas',
  '1_semana':  '1 semana',
  '2_4_dias':  '2-4 días',
}

function fmtMXN(v: string | number | null) {
  if (v === null || v === undefined) return '—'
  const n = Number(v)
  return new Intl.NumberFormat('es-MX', { style: 'currency', currency: 'MXN', maximumFractionDigits: 0 }).format(n)
}

function fmtDate(iso: string) {
  return new Date(iso).toLocaleDateString('es-MX', { day: 'numeric', month: 'short', year: 'numeric' })
}

export default function MyQuotes() {
  const { quotes, loading, error, refetch } = useQuotes()
  const navigate = useNavigate()

  if (loading) {
    return (
      <>
        <BackHeader />
        <div className={styles.page}>
          <div className={styles.inner}>
            <div className={styles.pageLoading}>
              <div className={styles.loadingBar} />
              <span className={styles.loadingText}>Cargando cotizaciones</span>
            </div>
          </div>
        </div>
      </>
    )
  }

  return (
    <>
      <BackHeader />
      <div className={styles.page}>
      <div className={styles.inner}>
        <div className={styles.head}>
          <div>
            <span className={styles.eyebrow}>NORIA Creative Film Studio</span>
            <h1 className={styles.title}>Mis Cotizaciones</h1>
            <p className={styles.subtitle}>Historial de tus solicitudes de producción</p>
          </div>
          <button className={styles.btn} onClick={() => navigate('/cotizacion')}>
            + Nueva cotización
          </button>
        </div>

        {error && (
          <div className={styles.errorBox}>
            {error}
            <button onClick={() => void refetch()}>Reintentar</button>
          </div>
        )}

        {!error && quotes.length === 0 && (
          <div className={styles.empty}>
            <div className={styles.emptyDivider} />
            <p className={styles.emptyTitle}>Sin cotizaciones registradas</p>
            <p className={styles.emptyText}>
              Aún no has solicitado ninguna cotización. Explora nuestros servicios y genera tu primera solicitud.
            </p>
            <button className={styles.btn} onClick={() => navigate('/cotizacion')}>
              Solicitar cotización
            </button>
          </div>
        )}

        {quotes.length > 0 && (
          <div className={styles.list}>
            {quotes.map((q) => (
              <div key={q.id} className={`${styles.card} ${CARD_STATUS_CSS[q.status] ?? ''}`}>

                {/* Header row */}
                <div className={styles.cardHeader}>
                  <div className={styles.cardLeft}>
                    <span className={styles.cardIcon}>{q.service_icon}</span>
                    <div>
                      <h3 className={styles.cardTitle}>{q.service_name}</h3>
                      <p className={styles.cardMeta}>
                        {q.quote_code && <><strong style={{ color: 'var(--red-light)', letterSpacing: '.04em' }}>{q.quote_code}</strong>{' · '}</>}
                        {q.shooting_duration ? (DURATION_LABEL[q.shooting_duration] ?? q.shooting_duration) : '—'}
                        {' · '}
                        {q.needs_drone ? 'Con dron' : 'Sin dron'}
                        {q.delivery_time ? ` · ${DELIVERY_LABEL[q.delivery_time] ?? q.delivery_time}` : ''}
                        {' · '}
                        {fmtDate(q.created_at)}
                      </p>
                    </div>
                  </div>
                  <div className={styles.cardRight}>
                    <span className={styles.price}>{fmtMXN(q.estimated_price)}</span>
                    <span className={`${styles.badge} ${STATUS_CSS[q.status] ?? ''}`}>
                      {STATUS_LABEL[q.status] ?? q.status}
                    </span>
                  </div>
                </div>

                {/* Cost breakdown strip */}
                <div className={styles.breakdown}>
                  <div className={styles.bItem}>
                    <span className={styles.bLabel}>Base</span>
                    <span className={styles.bValue}>{fmtMXN(q.base_price)}</span>
                  </div>
                  <div className={styles.bDivider} />
                  <div className={styles.bItem}>
                    <span className={styles.bLabel}>Producción</span>
                    <span className={styles.bValue}>{fmtMXN(q.production_cost)}</span>
                  </div>
                  <div className={styles.bDivider} />
                  <div className={styles.bItem}>
                    <span className={styles.bLabel}>Equipo</span>
                    <span className={styles.bValue}>{fmtMXN(q.equipment_cost)}</span>
                  </div>
                  <div className={styles.bDivider} />
                  <div className={styles.bItem}>
                    <span className={styles.bLabel}>Postprod.</span>
                    <span className={styles.bValue}>{fmtMXN(q.postproduction_cost)}</span>
                  </div>
                  <div className={styles.bDivider} />
                  <div className={styles.bItem}>
                    <span className={styles.bLabel}>Extras</span>
                    <span className={styles.bValue}>{fmtMXN(q.extras_cost)}</span>
                  </div>
                </div>

                {/* Actions */}
                {(q.status === 'generated' || q.status === 'scheduled') && (
                  <div className={styles.cardActions}>
                    {q.status === 'generated' && (
                      <button
                        className={styles.agendarBtn}
                        onClick={() => navigate(`/agendar/${q.id}`)}
                      >
                        <CalendarCheck size={13} strokeWidth={2} style={{ marginRight: '5px', verticalAlign: 'middle' }} />
                        Agendar cita
                      </button>
                    )}
                    {q.status === 'scheduled' && (
                      <span className={styles.scheduledBadge}>Cita agendada</span>
                    )}
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
      </div>
    </>
  )
}
