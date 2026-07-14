require('./config/env')               // valida variables primero
const express      = require('express')
const helmet       = require('helmet')
const morgan       = require('morgan')
const cors         = require('cors')
const cookieParser = require('cookie-parser')
const rateLimit    = require('express-rate-limit')
const env          = require('./config/env')

const app = express()

// ── Seguridad ──────────────────────────────────────────────
app.use(helmet())

// ── CORS — solo orígenes autorizados ──────────────────────
const allowed = [env.CLIENT_URL, env.ADMIN_URL]
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

// ── Rate limiting ─────────────────────────────────────────
const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 20,
  standardHeaders: true,
  legacyHeaders: false,
  message: { message: 'Demasiados intentos. Espera 15 minutos e intenta de nuevo.' },
})
const contactLimiter = rateLimit({
  windowMs: 60 * 60 * 1000,
  max: 10,
  standardHeaders: true,
  legacyHeaders: false,
  message: { message: 'Demasiados mensajes enviados. Intenta más tarde.' },
})

// ── Rutas API ─────────────────────────────────────────────
app.use('/api/auth',         authLimiter, require('./routes/auth.routes'))
app.use('/api/users',        require('./routes/users.routes'))
app.use('/api/services',     require('./routes/services.routes'))
app.use('/api/quotes',       require('./routes/quotes.routes'))
app.use('/api/contact',      contactLimiter, require('./routes/contact.routes'))
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
