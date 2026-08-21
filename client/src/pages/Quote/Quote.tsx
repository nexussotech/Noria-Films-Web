import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Check, CircleCheck } from 'lucide-react'
import api from '../../lib/api'
import { useAuth } from '../../context/AuthContext'
import { openWhatsAppAdmin } from '../../lib/whatsapp'
import BackHeader from '../../components/layout/BackHeader/BackHeader'
import type { ApiService, PricingConfig, QuoteCreatedResponse } from '../../types'
import styles from './Quote.module.css'

// ── Opciones del formulario ───────────────────────────────────
const SHOOTING_OPTIONS = [
  { key: '1_dia',  label: '1 día completo',  extra: '+$1,000' },
  { key: '2_dias', label: '2 días',           extra: '+$3,000' },
  { key: '3_plus', label: '3 o más días',     extra: '+$5,000' },
]

const DELIVERY_OPTIONS = [
  { key: '3_semanas', label: '3 semanas',   extra: '+$1,000' },
  { key: '1_semana',  label: '1 semana',    extra: '+$2,500' },
  { key: '2_4_dias',  label: '2 a 4 días',  extra: '+$3,500' },
]

interface QuoteForm {
  service_id:        number | null
  shooting_duration: string
  needs_drone:       boolean | null
  delivery_time:     string
  extra_notes:       string
}

const INIT: QuoteForm = {
  service_id:        null,
  shooting_duration: '',
  needs_drone:       null,
  delivery_time:     '',
  extra_notes:       '',
}

type Step = 1 | 2 | 3

function fmtMXN(n: number) {
  return new Intl.NumberFormat('es-MX', {
    style: 'currency', currency: 'MXN', maximumFractionDigits: 0,
  }).format(n)
}

function calcPreview(base: number, form: QuoteForm, cfg: PricingConfig | null) {
  if (!cfg) return { production: 0, equipment: 0, postproduction: 0, extras: 0, total: base }
  const production     = cfg.SHOOTING_DURATION_COST[form.shooting_duration] ?? 0
  const equipment      = form.needs_drone ? cfg.DRONE_COST : 0
  const postproduction = cfg.DELIVERY_TIME_COST[form.delivery_time] ?? 0
  const extras         = 0
  return { production, equipment, postproduction, extras, total: base + production + equipment + postproduction + extras }
}

const STEPS = [
  { n: 1 as Step, label: 'Servicio' },
  { n: 2 as Step, label: 'Complejidad' },
  { n: 3 as Step, label: 'Resumen' },
]

// ─────────────────────────────────────────────────────────────
export default function Quote() {
  const [step,       setStep]      = useState<Step>(1)
  const [form,       setForm]      = useState<QuoteForm>(INIT)
  const [services,   setServices]  = useState<ApiService[]>([])
  const [pricingCfg, setPricingCfg]= useState<PricingConfig | null>(null)
  const [svcLoading, setSvcLoading]= useState(true)
  const [submitting, setSubmitting]= useState(false)
  const [error,      setError]     = useState('')
  const [result,     setResult]    = useState<QuoteCreatedResponse | null>(null)

  const navigate = useNavigate()
  const { user } = useAuth()

  useEffect(() => {
    Promise.all([
      api.get<ApiService[]>('/services'),
      api.get<PricingConfig>('/quotes/pricing-config'),
    ]).then(([sRes, cRes]) => {
      setServices(sRes.data)
      setPricingCfg(cRes.data)
    }).finally(() => setSvcLoading(false))
  }, [])

  const selectedService = services.find((s) => s.id === form.service_id) ?? null
  const basePrice       = selectedService ? Number(selectedService.base_price) : 0
  const breakdown       = calcPreview(basePrice, form, pricingCfg)

  const step1Valid = form.service_id !== null
  const step2Valid =
    form.shooting_duration !== '' &&
    form.needs_drone !== null &&
    form.delivery_time !== ''

  const handleSubmit = async () => {
    if (!form.service_id || !step2Valid) return
    setSubmitting(true)
    setError('')
    try {
      const { data } = await api.post<QuoteCreatedResponse>('/quotes', {
        service_id:        form.service_id,
        shooting_duration: form.shooting_duration,
        needs_drone:       form.needs_drone,
        delivery_time:     form.delivery_time,
        extra_notes:       form.extra_notes || null,
      })
      setResult(data)
    } catch (e: unknown) {
      const msg = (e as { response?: { data?: { message?: string } } })
        ?.response?.data?.message ?? 'Error al enviar la cotización'
      setError(msg)
    } finally {
      setSubmitting(false)
    }
  }

  const sendQuoteWhatsApp = () => {
    if (!result) return
    openWhatsAppAdmin(
      `Nueva cotización — NORIA Films\n` +
      `Cliente: ${user?.full_name ?? '—'} (${user?.email ?? '—'})\n` +
      `Servicio: ${result.service_name}\n` +
      `Duración de rodaje: ${SHOOTING_OPTIONS.find((o) => o.key === form.shooting_duration)?.label ?? '—'}\n` +
      `Dron: ${form.needs_drone ? 'Sí' : 'No'}\n` +
      `Entrega: ${DELIVERY_OPTIONS.find((o) => o.key === form.delivery_time)?.label ?? '—'}\n` +
      `Notas: ${form.extra_notes || '—'}\n` +
      `Total estimado: ${fmtMXN(result.estimated_price)} MXN\n` +
      `Cotización #${result.id}`
    )
  }

  // ── Pantalla de éxito ───────────────────────────────────────
  if (result) {
    return (
      <>
        <BackHeader />
        <div className={styles.page}>
        <div className={styles.inner}>
          <div className={styles.card}>
            <div className={styles.successIcon}><CircleCheck size={32} strokeWidth={1.5} /></div>
            <h2 className={styles.successTitle}>Cotización generada</h2>
            <p className={styles.successSub}>
              Solicitud <strong>#{result.id}</strong> registrada exitosamente.
            </p>

            <div className={styles.breakdown}>
              <p className={styles.breakdownTitle}>Desglose del estimado</p>
              <BreakdownRow label="Servicio base"         value={result.base_price}          />
              <BreakdownRow label="Duración del rodaje"   value={result.production_cost}     />
              <BreakdownRow label="Equipo adicional"      value={result.equipment_cost}      />
              <BreakdownRow label="Tiempo de entrega"     value={result.postproduction_cost} />
              <BreakdownRow label="Extras"                value={result.extras_cost}         />
              <div className={styles.breakdownTotal}>
                <div>
                  <span>Total estimado</span>
                  <small>MXN · IVA no incluido</small>
                </div>
                <span className={styles.totalAmount}>{fmtMXN(result.estimated_price)}</span>
              </div>
            </div>

            <div className={styles.notice}>
              <p>Esta cotización es <strong>aproximada</strong> y puede variar según la logística y necesidades específicas del proyecto.</p>
              <p>Nuestro equipo se pondrá en contacto para afinar los detalles.</p>
            </div>

            <div className={styles.successActions}>
              <button
                className={styles.btnPrimary}
                onClick={sendQuoteWhatsApp}
              >
                Enviar por WhatsApp
              </button>
              <button
                className={styles.btnSecondary}
                onClick={() => navigate('/mis-cotizaciones')}
              >
                Ver mis cotizaciones
              </button>
            </div>
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

        {/* ── Page header ── */}
        <div className={styles.pageHeader}>
          <span className={styles.eyebrow}>NORIA Creative Film Studio · Producción</span>
          <h1 className={styles.title}>Solicitar Cotización</h1>
          <p className={styles.subtitle}>
            Selecciona el servicio y los detalles del proyecto para obtener un estimado de precio.
          </p>
        </div>

        {/* ── Step indicator ── */}
        <div className={styles.steps}>
          {STEPS.map((s) => (
            <div
              key={s.n}
              className={`${styles.step} ${s.n < step ? styles.done : ''} ${s.n === step ? styles.active : ''}`}
            >
              <span className={styles.stepNum}>{s.n < step ? <Check size={13} strokeWidth={2.5} /> : s.n}</span>
              <span className={styles.stepLabel}>{s.label}</span>
            </div>
          ))}
        </div>

        {/* ── PASO 1 — Selección de servicio ── */}
        {step === 1 && (
          <div className={styles.card}>
            <h2 className={styles.stepTitle}>¿Qué quieres producir?</h2>

            {svcLoading ? (
              <p className={styles.loading}>Cargando catálogo de servicios...</p>
            ) : (
              <div className={styles.serviceGrid}>
                {services.map((s) => (
                  <button
                    key={s.id}
                    className={`${styles.serviceCard} ${form.service_id === s.id ? styles.selected : ''}`}
                    onClick={() => setForm((p) => ({ ...p, service_id: s.id }))}
                  >
                    <span className={styles.serviceIcon}>{s.icon}</span>
                    <span className={styles.serviceName}>{s.name}</span>
                    <span className={styles.servicePrice}>{fmtMXN(Number(s.base_price))} MXN base</span>
                    <span className={styles.serviceCheckmark}><Check size={10} strokeWidth={3} /></span>
                  </button>
                ))}
              </div>
            )}

            <div className={styles.actions}>
              <button
                className={styles.btnPrimary}
                disabled={!step1Valid}
                onClick={() => setStep(2)}
              >
                Continuar →
              </button>
            </div>
          </div>
        )}

        {/* ── PASO 2 — Complejidad ── */}
        {step === 2 && (
          <div className={styles.card}>
            <h2 className={styles.stepTitle}>Complejidad del proyecto</h2>

            <div className={styles.form}>
              {/* Duración del rodaje */}
              <div className={styles.group}>
                <label className={styles.groupLabel}>
                  Duración del rodaje
                  <span className={styles.groupRequired}>*</span>
                </label>
                <div className={styles.optionRow}>
                  {SHOOTING_OPTIONS.map((o) => (
                    <button
                      key={o.key}
                      type="button"
                      className={`${styles.optionCard} ${form.shooting_duration === o.key ? styles.optionSelected : ''}`}
                      onClick={() => setForm((p) => ({ ...p, shooting_duration: o.key }))}
                    >
                      <span className={styles.optionMain}>{o.label}</span>
                      <span className={styles.optionExtra}>{o.extra}</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Dron */}
              <div className={styles.group}>
                <label className={styles.groupLabel}>
                  ¿Requieres toma con dron?
                  <span className={styles.groupRequired}>*</span>
                </label>
                <div className={styles.droneRow}>
                  <button
                    type="button"
                    className={`${styles.droneCard} ${form.needs_drone === true ? styles.droneSelected : ''}`}
                    onClick={() => setForm((p) => ({ ...p, needs_drone: true }))}
                  >
                    <span className={styles.droneLabel}>Sí, con dron</span>
                    <span className={styles.droneExtra}>+$2,000</span>
                  </button>
                  <button
                    type="button"
                    className={`${styles.droneCard} ${form.needs_drone === false ? styles.droneSelected : ''}`}
                    onClick={() => setForm((p) => ({ ...p, needs_drone: false }))}
                  >
                    <span className={styles.droneLabel}>No</span>
                    <span className={styles.droneExtra}>+$0</span>
                  </button>
                </div>
              </div>

              {/* Tiempo de entrega */}
              <div className={styles.group}>
                <label className={styles.groupLabel}>
                  Tiempo de entrega
                  <span className={styles.groupRequired}>*</span>
                </label>
                <div className={styles.optionRow}>
                  {DELIVERY_OPTIONS.map((o) => (
                    <button
                      key={o.key}
                      type="button"
                      className={`${styles.optionCard} ${form.delivery_time === o.key ? styles.optionSelected : ''}`}
                      onClick={() => setForm((p) => ({ ...p, delivery_time: o.key }))}
                    >
                      <span className={styles.optionMain}>{o.label}</span>
                      <span className={styles.optionExtra}>{o.extra}</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Notas */}
              <div className={styles.group}>
                <label className={styles.groupLabel}>Notas adicionales <em style={{ fontWeight: 400, textTransform: 'none', letterSpacing: 0 }}>(opcional)</em></label>
                <textarea
                  rows={3}
                  placeholder="Referencias, detalles especiales, plataforma de distribución..."
                  value={form.extra_notes}
                  onChange={(e) => setForm((p) => ({ ...p, extra_notes: e.target.value }))}
                  className={styles.textarea}
                />
              </div>

              {/* Preview de precio en tiempo real */}
              {step2Valid && basePrice > 0 && (
                <div className={styles.pricePreview}>
                  <div className={styles.previewLeft}>
                    <span className={styles.previewLabel}>Estimado preliminar</span>
                    <span className={styles.previewNote}>
                      Base {fmtMXN(basePrice)}
                      {breakdown.production > 0 && ` + Rodaje ${fmtMXN(breakdown.production)}`}
                      {breakdown.equipment  > 0 && ` + Dron ${fmtMXN(breakdown.equipment)}`}
                      {breakdown.postproduction > 0 && ` + Entrega ${fmtMXN(breakdown.postproduction)}`}
                    </span>
                  </div>
                  <span className={styles.previewValue}>{fmtMXN(breakdown.total)}</span>
                </div>
              )}
            </div>

            <div className={styles.actions}>
              <button className={styles.btnSecondary} onClick={() => setStep(1)}>← Atrás</button>
              <button
                className={styles.btnPrimary}
                disabled={!step2Valid}
                onClick={() => setStep(3)}
              >
                Ver resumen →
              </button>
            </div>
          </div>
        )}

        {/* ── PASO 3 — Resumen ── */}
        {step === 3 && selectedService && (
          <div className={styles.card}>
            <h2 className={styles.stepTitle}>Resumen de la cotización</h2>

            <div className={styles.breakdown}>
              <p className={styles.breakdownTitle}>Desglose del cálculo</p>

              <BreakdownRow
                label="Servicio base"
                sub={selectedService.name}
                value={basePrice}
              />
              <BreakdownRow
                label="Duración del rodaje"
                sub={SHOOTING_OPTIONS.find((o) => o.key === form.shooting_duration)?.label}
                value={breakdown.production}
              />
              <BreakdownRow
                label="Equipo adicional"
                sub={form.needs_drone ? 'Con toma de dron' : 'Sin dron'}
                value={breakdown.equipment}
              />
              <BreakdownRow
                label="Tiempo de entrega"
                sub={DELIVERY_OPTIONS.find((o) => o.key === form.delivery_time)?.label}
                value={breakdown.postproduction}
              />
              <BreakdownRow
                label="Extras"
                sub="—"
                value={breakdown.extras}
              />

              <div className={styles.breakdownTotal}>
                <div>
                  <span>Total estimado</span>
                  <small>MXN · IVA no incluido</small>
                </div>
                <span className={styles.totalAmount}>{fmtMXN(breakdown.total)}</span>
              </div>
            </div>

            <div className={styles.notice}>
              <p>Esta cotización es <strong>aproximada</strong> y puede variar según la logística y necesidades específicas del proyecto.</p>
              <p>Nuestro equipo se pondrá en contacto contigo para afinar los detalles.</p>
            </div>

            {error && <div className={styles.errorBox}>{error}</div>}

            <div className={styles.actions}>
              <button className={styles.btnSecondary} onClick={() => setStep(2)}>← Editar</button>
              <button
                className={styles.btnPrimary}
                disabled={submitting}
                onClick={handleSubmit}
              >
                {submitting ? 'Guardando...' : 'Confirmar cotización'}
              </button>
            </div>
          </div>
        )}
      </div>
      </div>
    </>
  )
}

// ── Componente auxiliar ───────────────────────────────────────
function BreakdownRow({ label, sub, value }: { label: string; sub?: string; value: number }) {
  return (
    <div className={styles.breakdownRow}>
      <div>
        <span className={styles.breakdownLabel}>{label}</span>
        {sub && <span className={styles.breakdownSub}>{sub}</span>}
      </div>
      <span className={`${styles.breakdownValue} ${value === 0 ? styles.zero : ''}`}>
        {value === 0 ? '$0' : fmtMXN(value)}
      </span>
    </div>
  )
}
