require('dotenv').config()

const required = ['DB_HOST', 'DB_USER', 'DB_NAME', 'JWT_SECRET']
const missing  = required.filter((k) => !process.env[k])

if (missing.length) {
  console.error(`[ENV] Variables faltantes: ${missing.join(', ')}`)
  process.exit(1)
}

module.exports = {
  PORT:           process.env.PORT           || '4000',
  NODE_ENV:       process.env.NODE_ENV       || 'development',
  DB_HOST:        process.env.DB_HOST,
  DB_PORT:        Number(process.env.DB_PORT || 3306),
  DB_USER:        process.env.DB_USER,
  DB_PASSWORD:    process.env.DB_PASSWORD    || '',
  DB_NAME:        process.env.DB_NAME,
  JWT_SECRET:     process.env.JWT_SECRET,
  JWT_EXPIRES_IN: process.env.JWT_EXPIRES_IN || '7d',
  CLIENT_URL:     process.env.CLIENT_URL     || 'http://localhost:5173',
  ADMIN_URL:      process.env.ADMIN_URL      || 'http://localhost:5174',
  MAIL_HOST:      process.env.MAIL_HOST      || '',
  MAIL_PORT:      Number(process.env.MAIL_PORT || 587),
  MAIL_USER:      process.env.MAIL_USER      || '',
  MAIL_PASS:      process.env.MAIL_PASS      || '',
  CLIENT_EMAIL_TO: process.env.CLIENT_EMAIL_TO || 'contacto@noriafilms.com',
  RESEND_API_KEY: process.env.RESEND_API_KEY  || '',
  RESEND_FROM:    process.env.RESEND_FROM     || 'NORIA Creative Film Studio <noreply@noriafilms.com>',
}
