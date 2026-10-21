require('./config/env')               // valida variables primero
const express      = require('express')
const helmet       = require('helmet')
const morgan       = require('morgan')
const cors         = require('cors')
const cookieParser = require('cookie-parser')
const env          = require('./config/env')

const app = express()

// Render (y la mayoría de PaaS) ponen el servidor detrás de un proxy que
// agrega X-Forwarded-For. Sin esto, express-rate-limit no puede identificar
// la IP real del cliente y lanza ERR_ERL_UNEXPECTED_X_FORWARDED_FOR.
app.set('trust proxy', 1)

// ── Seguridad ──────────────────────────────────────────────
app.use(helmet())

// ── CORS — solo orígenes autorizados ──────────────────────
// CLIENT_URL/ADMIN_URL admiten varios orígenes separados por coma
// (p. ej. "https://noriafilms.com,http://localhost:5173").
const allowed = [env.CLIENT_URL, env.ADMIN_URL]
  .flatMap((v) => v.split(',').map((s) => s.trim()))
  .filter(Boolean)
app.use(cors({
  origin: (origin, cb) => {
    if (!origin || allowed.includes(origin)) return cb(null, true)
    cb(Object.assign(new Error('Origen no autorizado'), { status: 403 }))
  },
  credentials: true,
}))
app.use((err, _req, res, next) => {
  if (err.status === 403) return res.status(403).json({ message: 'Acceso no autorizado' })
  next(err)
})

// ── Parsers ───────────────────────────────────────────────
app.use(express.json())
app.use(express.urlencoded({ extended: false }))
app.use(cookieParser())

// ── Logging ───────────────────────────────────────────────
if (env.NODE_ENV !== 'test') {
  app.use(morgan(env.NODE_ENV === 'production' ? 'combined' : 'dev'))
}

// ── Rutas API ─────────────────────────────────────────────
// Los rate limiters de login/registro y contacto se aplican dentro de cada
// router, solo a las rutas públicas correspondientes (ver auth.routes.js y
// contact.routes.js) — no al router completo, para no bloquear también las
// rutas autenticadas (/auth/me, listado/estado de mensajes en el panel admin).
app.use('/api/auth',         require('./routes/auth.routes'))
app.use('/api/users',        require('./routes/users.routes'))
app.use('/api/services',     require('./routes/services.routes'))
app.use('/api/quotes',       require('./routes/quotes.routes'))
app.use('/api/contact',      require('./routes/contact.routes'))
app.use('/api/admin',        require('./routes/admin.routes'))

// ── Health ────────────────────────────────────────────────
app.get('/api/health', (_, res) =>
  res.json({ status: 'ok', env: env.NODE_ENV, ts: new Date() })
)

// ── 404 ───────────────────────────────────────────────────
app.use((_, res) => res.status(404).json({ message: 'Ruta no encontrada' }))

// ── Error handler global ──────────────────────────────────
// eslint-disable-next-line no-unused-vars
app.use((err, _req, res, _next) => {
  console.error('[APP ERROR]', err.message)
  const message = env.NODE_ENV === 'production' ? 'Error interno del servidor' : err.message
  res.status(err.status || 500).json({ message })
})

module.exports = app
