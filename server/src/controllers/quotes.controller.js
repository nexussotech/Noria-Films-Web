const db            = require('../config/db')
const R             = require('../utils/response')
const {
  calcPrice,
  SHOOTING_DURATION_COST,
  DELIVERY_TIME_COST,
}                   = require('../utils/pricing')

// ── POST /api/quotes ─────────────────────────────────────────
exports.create = async (req, res) => {
  try {
    const { service_id, shooting_duration, needs_drone, delivery_time, project_type, extra_notes } = req.body
    const userId = req.user.id

    // Verificar servicio activo
    const [[svc]] = await db.query('SELECT id, name, base_price FROM services WHERE id=? AND active=1', [service_id])
    if (!svc) return R.notFound(res, 'Servicio no encontrado o inactivo')

    // Validar opciones de complejidad
    if (!SHOOTING_DURATION_COST[shooting_duration])
      return R.badRequest(res, `Duración inválida: ${shooting_duration}`)
    if (!DELIVERY_TIME_COST[delivery_time])
      return R.badRequest(res, `Tiempo de entrega inválido: ${delivery_time}`)

    // El backend calcula el precio — nunca se acepta el total del cliente
    const drone = Boolean(needs_drone)
    const breakdown = calcPrice({
      base_price:        svc.base_price,
      shooting_duration,
      needs_drone:       drone,
      delivery_time,
    })

    const [result] = await db.query(
      `INSERT INTO quotes
         (user_id, service_id, shooting_duration, needs_drone, delivery_time,
          project_type, extra_notes,
          production_cost, equipment_cost, postproduction_cost, extras_cost,
          estimated_price, status)
       VALUES (?,?,?,?,?,?,?,?,?,?,?,?,'generated')`,
      [
        userId, service_id,
        shooting_duration, drone ? 1 : 0, delivery_time,
        project_type || null, extra_notes || null,
        breakdown.production_cost,
        breakdown.equipment_cost,
        breakdown.postproduction_cost,
        breakdown.extras_cost,
        breakdown.estimated_price,
      ]
    )

    return R.created(res, {
      id:         result.insertId,
      status:     'generated',
      service_name:        svc.name,
      base_price:          Number(svc.base_price),
      production_cost:     breakdown.production_cost,
      equipment_cost:      breakdown.equipment_cost,
      postproduction_cost: breakdown.postproduction_cost,
      extras_cost:         breakdown.extras_cost,
      estimated_price:     breakdown.estimated_price,
    })
  } catch (err) { return R.serverError(res, err) }
}

// ── GET /api/quotes/my ───────────────────────────────────────
exports.myQuotes = async (req, res) => {
  try {
    const [rows] = await db.query(
      `SELECT q.id, q.service_id, q.shooting_duration, q.needs_drone, q.delivery_time,
              q.project_type, q.extra_notes,
              q.production_cost, q.equipment_cost, q.postproduction_cost,
              q.extras_cost, q.estimated_price, q.status,
              q.created_at, q.updated_at,
              s.name AS service_name, s.icon AS service_icon, s.base_price
       FROM quotes q
       JOIN services s ON s.id = q.service_id
       WHERE q.user_id = ?
       ORDER BY q.created_at DESC`,
      [req.user.id]
    )
    return R.ok(res, rows)
  } catch (err) { return R.serverError(res, err) }
}

// ── GET /api/quotes/:id ──────────────────────────────────────
exports.getOne = async (req, res) => {
  try {
    const [rows] = await db.query(
      `SELECT q.*, s.name AS service_name, s.icon AS service_icon,
              s.base_price AS service_base_price,
              u.full_name, u.email, u.phone
       FROM quotes q
       JOIN services s ON s.id = q.service_id
       JOIN users   u ON u.id  = q.user_id
       WHERE q.id = ?`,
      [req.params.id]
    )
    if (!rows.length) return R.notFound(res, 'Cotización no encontrada')
    const q = rows[0]
    if (req.user.role !== 'admin' && q.user_id !== req.user.id)
      return R.forbidden(res)
    return R.ok(res, q)
  } catch (err) { return R.serverError(res, err) }
}

// ── GET /api/quotes — admin ──────────────────────────────────
exports.listAll = async (req, res) => {
  try {
    const { status, user_id, service_id } = req.query
    let sql = `SELECT q.*, s.name AS service_name, u.full_name, u.email, u.phone
               FROM quotes q
               JOIN services s ON s.id = q.service_id
               JOIN users   u  ON u.id = q.user_id
               WHERE 1=1`
    const params = []
    if (status)     { sql += ' AND q.status=?';     params.push(status) }
    if (user_id)    { sql += ' AND q.user_id=?';    params.push(user_id) }
    if (service_id) { sql += ' AND q.service_id=?'; params.push(service_id) }
    sql += ' ORDER BY q.created_at DESC'
    const [rows] = await db.query(sql, params)
    return R.ok(res, rows)
  } catch (err) { return R.serverError(res, err) }
}

// ── PATCH /api/quotes/:id/status — admin ─────────────────────
exports.updateStatus = async (req, res) => {
  try {
    const allowed = ['draft', 'generated', 'cancelled']
    const { status } = req.body
    if (!allowed.includes(status)) return R.badRequest(res, 'Estado inválido')
    await db.query('UPDATE quotes SET status=? WHERE id=?', [status, req.params.id])
    return R.ok(res, { message: 'Estado actualizado' })
  } catch (err) { return R.serverError(res, err) }
}
