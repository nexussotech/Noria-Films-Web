import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell } from 'recharts'
import api from '../../lib/api'
import type { DashboardStats } from '../../types'
import styles from './Dashboard.module.css'

export default function Dashboard() {
  const [stats,   setStats]   = useState<DashboardStats | null>(null)
  const [loading, setLoading] = useState(true)
  const [error,   setError]   = useState('')
  const navigate = useNavigate()

  useEffect(() => {
    api.get<DashboardStats>('/admin/dashboard/stats')
      .then(({ data }) => setStats(data))
      .catch(() => setError('No se pudieron cargar las estadísticas'))
      .finally(() => setLoading(false))
  }, [])

  return (
    <div className={styles.page}>
      <div className={styles.head}>
        <div>
          <h1 className={styles.title}>Dashboard</h1>
          <p className={styles.sub}>Resumen general de NORIA Films</p>
        </div>
      </div>

      {loading && <p className="msg-loading">Cargando estadísticas...</p>}
      {error   && <p className="msg-error">{error}</p>}

      {stats && (
        <>
          <section className={styles.section}>
            <h2 className={styles.sectionTitle}>Embudo de conversión</h2>
            <div className={styles.chartWrap}>
              <ResponsiveContainer width="100%" height={200}>
                <BarChart
                  data={[
                    { name: 'Registrados',    value: stats.total_users,       fill: '#F3F3F1' },
                    { name: 'Con cotización', value: stats.users_with_quotes, fill: '#7ab4e8' },
                    { name: 'Pendientes',     value: stats.pending_quotes,    fill: '#d4a840' },
                    { name: 'Mensajes',       value: stats.new_messages,      fill: '#A73436' },
                  ]}
                  margin={{ top: 8, right: 16, left: -16, bottom: 0 }}
                >
                  <XAxis dataKey="name" tick={{ fill: '#8b8fa8', fontSize: 11 }} axisLine={false} tickLine={false} />
                  <YAxis allowDecimals={false} tick={{ fill: '#8b8fa8', fontSize: 11 }} axisLine={false} tickLine={false} />
                  <Tooltip
                    cursor={{ fill: 'rgba(255,255,255,.04)' }}
                    contentStyle={{ background: '#1a1d27', border: '1px solid #2a2d3a', borderRadius: 3, fontSize: '.82rem' }}
                    itemStyle={{ color: '#F3F3F1' }}
                    labelStyle={{ color: '#8b8fa8', marginBottom: 4 }}
                  />
                  <Bar dataKey="value" radius={[3, 3, 0, 0]} name="Total">
                    {[
                      '#F3F3F1', '#7ab4e8', '#d4a840', '#A73436',
                    ].map((color, i) => <Cell key={i} fill={color} />)}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
            <div className={styles.grid3}>
              <StatCard label="Usuarios registrados"  value={stats.total_users}          accent="cream"  onClick={() => navigate('/usuarios')} />
              <StatCard label="Total cotizaciones"     value={stats.total_quotes}          accent="blue"   onClick={() => navigate('/cotizaciones')} />
              <StatCard label="Tasa de conversión"     value={`${stats.conversion_rate}%`} accent="red"   />
            </div>
          </section>

          <section className={styles.section}>
            <h2 className={styles.sectionTitle}>Atención pendiente</h2>
            <div className={styles.grid3}>
              <StatCard label="Cotizaciones sin revisar" value={stats.pending_quotes}     accent="yellow" onClick={() => navigate('/cotizaciones')} />
              <StatCard label="Mensajes nuevos"           value={stats.new_messages}       accent="red"    onClick={() => navigate('/mensajes')} />
              <StatCard label="Usuarios con cotización"   value={stats.users_with_quotes}  accent="blue" />
            </div>
          </section>
        </>
      )}
    </div>
  )
}

function StatCard({
  label, value, accent, onClick,
}: { label: string; value: number | string; accent: string; onClick?: () => void }) {
  return (
    <div className={`${styles.card} ${onClick ? styles.clickable : ''}`} onClick={onClick}>
      <span className={`${styles.cardValue} ${styles[accent]}`}>{value}</span>
      <span className={styles.cardLabel}>{label}</span>
      {onClick && <span className={styles.cardArrow}>→</span>}
    </div>
  )
}
