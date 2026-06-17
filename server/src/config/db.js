const mysql = require('mysql2/promise')
const env   = require('./env')

const pool = mysql.createPool({
  host:               env.DB_HOST,
  port:               env.DB_PORT,
  user:               env.DB_USER,
  password:           env.DB_PASSWORD,
  database:           env.DB_NAME,
  waitForConnections: true,
  connectionLimit:    10,
  timezone:           '+00:00',
})

pool.getConnection()
  .then((c) => { console.log('[DB] MySQL conectado'); c.release() })
  .catch((e) => {
    console.error('[DB] Error de conexión:', e.message)
    console.error('[DB] Revisa DB_HOST, DB_USER, DB_PASSWORD en .env y que MySQL esté corriendo')
    if (process.env.NODE_ENV === 'production') process.exit(1)
  })

module.exports = pool
