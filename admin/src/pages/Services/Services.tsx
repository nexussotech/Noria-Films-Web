import { useEffect, useState } from 'react'
import toast from 'react-hot-toast'
import api from '../../lib/api'
import type { ServiceRow } from '../../types'
import styles from './Services.module.css'

function fmtMXN(v: string | null) {
  if (!v) return '—'
  return new Intl.NumberFormat('es-MX', { style: 'currency', currency: 'MXN', maximumFractionDigits: 0 }).format(Number(v))
}

interface EditState {
  name: string
  description: string
  base_price: string
  icon: string
}

export default function Services() {
  const [services, setServices] = useState<ServiceRow[]>([])
  const [loading,  setLoading]  = useState(true)
  const [error,    setError]    = useState('')
  const [editing,  setEditing]  = useState<number | null>(null)
  const [editForm, setEditForm] = useState<EditState>({ name: '', description: '', base_price: '', icon: '' })
  const [saving,   setSaving]   = useState(false)

  const load = async () => {
    setLoading(true)
    try {
      const { data } = await api.get<ServiceRow[]>('/services')
      setServices(data)
    } catch {
      setError('No se pudieron cargar los servicios')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => { void load() }, [])

  const startEdit = (s: ServiceRow) => {
    setEditing(s.id)
    setEditForm({
      name:        s.name,
      description: s.description,
      base_price:  s.base_price ?? '',
      icon:        s.icon ?? '',
    })
  }

  const cancelEdit = () => { setEditing(null) }

  const saveEdit = async (s: ServiceRow) => {
    setSaving(true)
    try {
      await api.put(`/services/${s.id}`, {
        name:        editForm.name,
        description: editForm.description,
        base_price:  editForm.base_price ? Number(editForm.base_price) : null,
        icon:        editForm.icon || null,
        image_url:   s.image_url,
        active:      s.active,
      })
      setServices((prev) => prev.map((svc) =>
        svc.id === s.id
          ? { ...svc, name: editForm.name, description: editForm.description, base_price: editForm.base_price, icon: editForm.icon }
          : svc
      ))
      toast.success('Cambios guardados')
      setEditing(null)
    } catch {
      toast.error('Error al guardar los cambios')
    } finally {
      setSaving(false)
    }
  }

  const toggleActive = async (s: ServiceRow) => {
    const newActive = s.active ? 0 : 1
    try {
      await api.put(`/services/${s.id}`, {
        name: s.name, description: s.description,
        base_price: s.base_price ? Number(s.base_price) : null,
        icon: s.icon, image_url: s.image_url,
        active: newActive,
      })
      setServices((prev) => prev.map((svc) => svc.id === s.id ? { ...svc, active: newActive } : svc))
    } catch { /* silently */ }
  }

  return (
    <div className="admin-page">
      <div className="admin-head">
        <div>
          <h1 className="admin-title">Servicios <span className="count-chip">{services.length}</span></h1>
          <p className="admin-sub">Catálogo de servicios de producción</p>
        </div>
      </div>

      {error   && <p className="msg-error">{error}</p>}
      {loading && <p className="msg-loading">Cargando servicios...</p>}

      {!loading && (
        <div className={styles.grid}>
          {services.map((s) => (
            <div key={s.id} className={`${styles.card} ${!s.active ? styles.inactive : ''}`}>

              {/* Card header */}
              <div className={styles.cardTop}>
                <span className={styles.icon}>{s.icon ?? '—'}</span>
                <div className={styles.cardMeta}>
                  <span className={`badge ${s.active ? 'bd-active' : 'bd-inactive'}`}>
                    {s.active ? 'Activo' : 'Inactivo'}
                  </span>
                  <span className={styles.cardId}>ID {s.id}</span>
                </div>
              </div>

              {/* Card body — view mode */}
              {editing !== s.id ? (
                <>
                  <h3 className={styles.name}>{s.name}</h3>
                  <p className={styles.desc}>{s.description}</p>
                  <div className={styles.price}>
                    <span className={styles.priceLabel}>Precio base</span>
                    <span className={styles.priceValue}>{fmtMXN(s.base_price)} <small>MXN</small></span>
                  </div>

                  <div className={styles.cardActions}>
                    <button className="btn-sm btn-ghost" onClick={() => startEdit(s)}>
                      Editar
                    </button>
                    <button
                      className={`btn-sm ${s.active ? 'btn-danger' : 'btn-ghost'}`}
                      onClick={() => void toggleActive(s)}
                    >
                      {s.active ? 'Desactivar' : 'Activar'}
                    </button>
                  </div>
                </>
              ) : (
                /* Edit mode */
                <div className={styles.editForm}>
                  <div className={styles.field}>
                    <label className={styles.label}>Nombre</label>
                    <input
                      className="admin-input"
                      value={editForm.name}
                      onChange={(e) => setEditForm((p) => ({ ...p, name: e.target.value }))}
                    />
                  </div>
                  <div className={styles.field}>
                    <label className={styles.label}>Descripción</label>
                    <textarea
                      className={`admin-input ${styles.textarea}`}
                      rows={2}
                      value={editForm.description}
                      onChange={(e) => setEditForm((p) => ({ ...p, description: e.target.value }))}
                    />
                  </div>
                  <div className={styles.row2}>
                    <div className={styles.field}>
                      <label className={styles.label}>Precio base (MXN)</label>
                      <input
                        type="number"
                        className="admin-input"
                        value={editForm.base_price}
                        onChange={(e) => setEditForm((p) => ({ ...p, base_price: e.target.value }))}
                      />
                    </div>
                    <div className={styles.field}>
                      <label className={styles.label}>Ícono (emoji)</label>
                      <input
                        className="admin-input"
                        maxLength={4}
                        value={editForm.icon}
                        onChange={(e) => setEditForm((p) => ({ ...p, icon: e.target.value }))}
                      />
                    </div>
                  </div>
                  <div className={styles.editActions}>
                    <button className="btn-sm btn-ghost" onClick={cancelEdit}>Cancelar</button>
                    <button
                      className="btn-sm btn-primary"
                      disabled={saving || !editForm.name.trim()}
                      onClick={() => void saveEdit(s)}
                    >
                      {saving ? 'Guardando...' : 'Guardar'}
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
