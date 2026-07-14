require('./config/env')
const app = require('./app')
const env = require('./config/env')

// Inicializa conexión a MySQL (falla rápido si no conecta)
require('./config/db')

const server = app.listen(env.PORT, () => {
  console.log(`[SERVER] NORIA API → http://localhost:${env.PORT}  (${env.NODE_ENV})`)
})

// Graceful shutdown
const shutdown = (signal) => {
  console.log(`[SERVER] ${signal} recibido, cerrando...`)
  server.close(() => process.exit(0))
}
process.on('SIGTERM', () => shutdown('SIGTERM'))
process.on('SIGINT',  () => shutdown('SIGINT'))
