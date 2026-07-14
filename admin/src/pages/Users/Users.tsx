import { useEffect, useState, useCallback } from 'react'
import { useNavigate } from 'react-router-dom'
import api from '../../lib/api'
import type { AdminUser } from '../../types'
import styles from './Users.module.css'

type FilterMode = 'all' | 'quoted'

function fmtDate(iso: string) {
  return new Date(iso).toLocaleDateString('es-MX', { day: 'numeric', month: 'short', year: 'numeric' })
}

export default function Users() {
  const [users,   setUsers]   = useState<AdminUser[]>([])
  const [loading, setLoading] = useState(true)
  const [error,   setError]   = useState('')
  const [search,  setSearch]  = useState('')
  const [filter,  setFilter]  = useState<FilterMode>('all')
  const navigate = useNavigate()

  const load = useCallback(async () => {
    setLoading(true)
    setError('')
    try {
      const params: Record<string, string> = {}
      if (search) params.search = search
      if (filter === 'quoted') { params.hasQuote = 'true' }
      const { data } = await api.get<AdminUser[]>('/users', { params })
      setUsers(data)
    } catch {
      setError('No se pudieron cargar los usuarios')
    } finally {
      setLoading(false)
    }
  }, [search, filter])

  useEffect(() => { void load() }, [load])

  const FILTERS: { key: FilterMode; label: string }[] = [
    { key: 'all',    label: 'Todos' },
    { key: 'quoted', label: 'Con cotización' },
  ]

  return (
    <div className="admin-page">
      <div className="admin-head">
        <div>
          <h1 className="admin-title">Usuarios <span className="count-chip">{users.length}</span></h1>
          <p className="admin-sub">Clientes registrados en la plataforma</p>
        </div>
      </div>

      {/* Filters */}
      <div className={styles.toolbar}>
        <input
          type="search"
          placeholder="Buscar por nombre o correo..."
          className={`admin-input ${styles.searchInput}`}
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
        <div className="filter-tabs">
          {FILTERS.map((f) => (
            <button
              key={f.key}
              className={`filter-tab ${filter === f.key ? 'active' : ''}`}
              onClick={() => setFilter(f.key)}
            >
              {f.label}
            </button>
          ))}
        </div>
      </div>

      {error   && <p className="msg-error">{error}</p>}
      {loading && <p className="msg-loading">Cargando usuarios...</p>}

      {!loading && (
        <div className="tbl-wrap">
          <table className="tbl">
            <thead>
              <tr>
                <th>#</th>
                <th>Nombre / Correo</th>
                <th>Teléfono</th>
                <th>Cotizaciones</th>
                <th>Estado</th>
                <th>Registrado</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {users.length === 0 ? (
                <tr><td colSpan={7} className="empty-state">No hay usuarios con ese criterio</td></tr>
              ) : users.map((u) => (
                <tr key={u.id} className={styles.row} onClick={() => navigate(`/usuarios/${u.id}`)}>
                  <td className={styles.idCell}>{u.id}</td>
                  <td>
                    <div className={styles.nameCell}>
                      <div className={styles.avatar}>{u.full_name.charAt(0).toUpperCase()}</div>
                      <div>
                        <div className={styles.name}>{u.full_name}</div>
                        <div className={styles.email}>{u.email}</div>
                      </div>
                    </div>
                  </td>
                  <td>{u.phone ?? <span style={{ color: 'var(--gray)' }}>—</span>}</td>
                  <td>
                    <span className={`badge ${u.quote_count > 0 ? 'bd-scheduled' : 'bd-read'}`}>
                      {u.quote_count}
                    </span>
                  </td>
                  <td>
                    <span className={`badge ${u.status === 'active' ? 'bd-active' : 'bd-inactive'}`}>
                      {u.status === 'active' ? 'Activo' : 'Inactivo'}
                    </span>
                  </td>
                  <td className={styles.dateCell}>{fmtDate(u.created_at)}</td>
                  <td><button className="btn-sm btn-ghost" onClick={(e) => { e.stopPropagation(); navigate(`/usuarios/${u.id}`) }}>Ver →</button></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}
