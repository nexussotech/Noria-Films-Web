// ============================================================
//  NORIA Films — Lógica de precios oficial (v3)
//  Fórmula aditiva: Total = Base + Producción + Equipo + Postproducción + Extras
//  El backend SIEMPRE recalcula; nunca confía en el total del cliente.
// ============================================================

// Costo por duración del rodaje
const SHOOTING_DURATION_COST = {
  '1_dia':    1000,
  '2_dias':   3000,
  '3_plus':   5000,
}

// Costo por uso de dron
const DRONE_COST = 2000   // si needs_drone=true, suma este monto

// Costo por tiempo de entrega (postproducción)
const DELIVERY_TIME_COST = {
  '3_semanas': 1000,
  '1_semana':  2500,
  '2_4_dias':  3500,
}

// Claves válidas (para validación en rutas)
const VALID_SHOOTING_DURATIONS = Object.keys(SHOOTING_DURATION_COST)
const VALID_DELIVERY_TIMES     = Object.keys(DELIVERY_TIME_COST)

/**
 * Calcula el desglose completo de una cotización.
 *
 * @param {object} params
 * @param {number}  params.base_price        Precio base del servicio
 * @param {string}  params.shooting_duration  Clave de duración ('1_dia' | '2_dias' | '3_plus')
 * @param {boolean} params.needs_drone        ¿Requiere dron?
 * @param {string}  params.delivery_time      Clave de entrega ('3_semanas' | '1_semana' | '2_4_dias')
 *
 * @returns {{ production_cost, equipment_cost, postproduction_cost, extras_cost, estimated_price }}
 */
function calcPrice({ base_price, shooting_duration, needs_drone, delivery_time }) {
  const production_cost     = SHOOTING_DURATION_COST[shooting_duration] ?? 0
  const equipment_cost      = needs_drone ? DRONE_COST : 0
  const postproduction_cost = DELIVERY_TIME_COST[delivery_time]     ?? 0
  const extras_cost         = 0   // campo reservado para expansión futura

  const estimated_price =
    Number(base_price) +
    production_cost    +
    equipment_cost     +
    postproduction_cost +
    extras_cost

  return { production_cost, equipment_cost, postproduction_cost, extras_cost, estimated_price }
}

module.exports = {
  calcPrice,
  SHOOTING_DURATION_COST,
  DRONE_COST,
  DELIVERY_TIME_COST,
  VALID_SHOOTING_DURATIONS,
  VALID_DELIVERY_TIMES,
}
