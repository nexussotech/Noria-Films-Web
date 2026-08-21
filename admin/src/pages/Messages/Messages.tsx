import { useEffect, useState, useCallback, useRef, type FormEvent } from 'react'
import { MessageCircle } from 'lucide-react'
import api from '../../lib/api'
import { openWhatsApp } from '../../lib/whatsapp'
import type { ContactMsg } from '../../types'
import styles from './Messages.module.css'

type StatusFilter = 'all' | 'new' | 'read' | 'archived' | 'answered'

const STATUS_LABEL: Record<string, string> = {
  new:      'Nuevo',
  read:     'Leído',
  archived: 'Archivado',
  answered: 'Respondido',
}
const STATUS_TABS: { key: StatusFilter; label: string }[] = [
  { key: 'all',      label: 'Todos' },
  { key: 'new',      label: 'Nuevos' },
  { key: 'read',     label: 'Leídos' },
  { key: 'answered', label: 'Respondidos' },
  { key: 'archived', label: 'Archivados' },
]

function fmtDate(iso: string) {
  return new Date(iso).toLocaleDateString('es-MX', {
    day: 'numeric', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit',
  })
}

export default function Messages() {
  const [msgs,      setMsgs]      = useState<ContactMsg[]>([])
  const [loading,   setLoading]   = useState(true)
  const [error,     setError]     = useState('')
  const [filter,    setFilter]    = useState<StatusFilter>('all')
  const [expanded,  setExpanded]  = useState<number | null>(null)
  const searchRef  = useRef<HTMLInputElement>(null)
  const [query,    setQuery]    = useState('')

  const load = useCallback(async () => {
    setLoading(true)
    setError('')
    try {
      const params = filter !== 'all' ? { status: filter } : {}
      const { data } = await api.get<ContactMsg[]>('/contact', { params })
      setMsgs(data)
    } catch {
      setError('No se pudieron cargar los mensajes')
    } finally {
      setLoading(false)
    }
  }, [filter])

  useEffect(() => { void load() }, [load])

  const setStatus = async (id: number, status: string) => {
    try {
      await api.patch(`/contact/${id}/status`, { status })
      setMsgs((prev) => prev.map((m) => m.id === id ? { ...m, status: status as ContactMsg['status'] } : m))
    } catch { /* silently */ }
  }

  const followUpWhatsApp = (msg: ContactMsg) => {
    if (!msg.phone) return
    openWhatsApp(
      msg.phone,
      `Hola ${msg.full_name}, te contactamos de NORIA Creative Film Studio respecto a tu mensaje "${msg.subject}".`
    )
    void setStatus(msg.id, 'answered')
  }

  const handleSearch = (e: FormEvent) => {
    e.preventDefault()
    setQuery(searchRef.current?.value.trim() ?? '')
  }
  const handleClear = () => {
    setQuery('')
    if (searchRef.current) searchRef.current.value = ''
  }

  const q = query.toLowerCase()
  const visible = q
    ? msgs.filter((m) =>
        m.full_name.toLowerCase().includes(q) ||
        m.email.toLowerCase().includes(q) ||
        m.subject.toLowerCase().includes(q)
      )
    : msgs

  const newCount = msgs.filter((m) => m.status === 'new').length

  return (
    <div className="admin-page">
      <div className="admin-head">
        <div>
          <h1 className="admin-title">
            Mensajes
            {newCount > 0 && <span className={styles.newBadge}>{newCount} nuevos</span>}
          </h1>
          <p className="admin-sub">Mensajes del formulario de contacto</p>
        </div>
      </div>

      <div className="filter-tabs">
        {STATUS_TABS.map((t) => (
          <button key={t.key} className={`filter-tab ${filter === t.key ? 'active' : ''}`} onClick={() => setFilter(t.key)}>
            {t.label}
          </button>
        ))}
      </div>

      <form className={styles.searchForm} onSubmit={handleSearch}>
        <input
          ref={searchRef}
          type="search"
          placeholder="Buscar por nombre, email o asunto..."
          className={`admin-input ${styles.searchInput}`}
          defaultValue=""
        />
        <button type="submit" className="btn-sm btn-ghost">Buscar</button>
        {query && <button type="button" className="btn-sm btn-ghost" onClick={handleClear}>Limpiar</button>}
      </form>

      {error   && <p className="msg-error">{error}</p>}
      {loading && <p className="msg-loading">Cargando mensajes...</p>}

      {!loading && visible.length === 0 && (
        <div className="empty-state">{query ? 'Sin resultados para esa búsqueda' : 'Sin mensajes en este estado'}</div>
      )}

      {!loading && (
        <div className={styles.list}>
          {visible.map((m) => (
            <div key={m.id} className={`${styles.card} ${m.status === 'new' ? styles.cardNew : ''} ${m.status === 'answered' ? styles.cardAnswered : ''}`}>
              <div className={styles.cardHeader} onClick={() => setExpanded(expanded === m.id ? null : m.id)}>
                <div className={styles.sender}>
                  <div className={styles.avatar}>{m.full_name.charAt(0).toUpperCase()}</div>
                  <div className={styles.senderInfo}>
                    <span className={styles.name}>{m.full_name}</span>
                    <span className={styles.email}>{m.email}{m.phone ? ` · ${m.phone}` : ''}</span>
                  </div>
                </div>

                <div className={styles.meta}>
                  <span className={styles.subject}>{m.subject}</span>
                  <span className={styles.date}>{fmtDate(m.created_at)}</span>
                </div>

                <div className={styles.actions}>
                  <span className={`badge bd-${m.status}`}>{STATUS_LABEL[m.status] ?? m.status}</span>
                  <span className={styles.expand}>{expanded === m.id ? '▲' : '▼'}</span>
                </div>
              </div>

              {expanded === m.id && (
                <div className={styles.body}>
                  <p className={styles.msgText}>{m.message}</p>

                  <div className={styles.bodyActions}>
                    {m.status !== 'read' && m.status !== 'answered' && (
                      <button className="btn-sm btn-ghost" onClick={() => void setStatus(m.id, 'read')}>
                        Marcar leído
                      </button>
                    )}
                    {m.status !== 'archived' && (
                      <button className="btn-sm btn-ghost" onClick={() => void setStatus(m.id, 'archived')}>
                        Archivar
                      </button>
                    )}
                    {m.status === 'archived' && (
                      <button className="btn-sm btn-ghost" onClick={() => void setStatus(m.id, 'read')}>
                        Restaurar
                      </button>
                    )}
                    <button
                      className="btn-sm btn-primary"
                      disabled={!m.phone}
                      title={m.phone ? undefined : 'Sin teléfono registrado'}
                      onClick={() => followUpWhatsApp(m)}
                    >
                      <MessageCircle size={13} style={{ marginRight: '4px', verticalAlign: 'middle' }} />
                      Seguimiento por WhatsApp
                    </button>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
