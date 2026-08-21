const nodemailer = require('nodemailer')
const env = require('../config/env')

function esc(str) {
  if (str == null) return ''
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#x27;')
}

const configured = !!(env.MAIL_USER && env.MAIL_PASS && env.MAIL_HOST)

const transporter = configured
  ? nodemailer.createTransport({
      host: env.MAIL_HOST, port: env.MAIL_PORT, secure: env.MAIL_PORT === 465,
      auth: { user: env.MAIL_USER, pass: env.MAIL_PASS },
    })
  : null

async function send({ to, subject, html }) {
  if (!transporter) {
    console.log(`[EMAIL SIMULADO] → ${to} | ${subject}`)
    return
  }
  await transporter.sendMail({
    from: `"NORIA Creative Film Studio" <${env.MAIL_USER}>`,
    to, subject, html,
  })
}

// ── Layout base ─────────────────────────────────────────────

function layout(title, body) {
  return `<!DOCTYPE html>
<html lang="es">
<head><meta charset="UTF-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>${title}</title></head>
<body style="margin:0;padding:20px 0;background:#0f1117;font-family:Arial,Helvetica,sans-serif;color:#F3F3F1">
  <div style="max-width:600px;margin:0 auto;background:#1a1d27;border:1px solid #2a2d3a;border-radius:4px;overflow:hidden">

    <!-- Header -->
    <div style="background:#A73436;padding:28px 32px;text-align:center">
      <p style="margin:0 0 4px;color:rgba(243,243,241,.7);font-size:11px;letter-spacing:3px;text-transform:uppercase">Estudio de Producción Audiovisual</p>
      <h1 style="margin:0;color:#F3F3F1;font-size:20px;letter-spacing:2px;text-transform:uppercase;font-weight:700">
        NORIA Creative Film Studio
      </h1>
    </div>

    <!-- Body -->
    <div style="padding:32px">
      ${body}
    </div>

    <!-- Footer -->
    <div style="padding:16px 32px 24px;border-top:1px solid #2a2d3a;text-align:center">
      <p style="margin:0;color:#8b8fa8;font-size:11px;line-height:1.6">
        Este correo fue generado automáticamente por el sistema de NORIA Creative Film Studio.<br>
        Por favor no responda a este mensaje directamente.
      </p>
    </div>

  </div>
</body>
</html>`
}

function heading(text) {
  return `<h2 style="margin:0 0 8px;color:#F3F3F1;font-size:18px;font-weight:700">${esc(text)}</h2>`
}

function subtext(text) {
  return `<p style="margin:0 0 24px;color:#8b8fa8;font-size:14px;line-height:1.6">${esc(text)}</p>`
}

function notice(text) {
  return `<p style="margin:20px 0 0;padding:12px 16px;background:rgba(167,52,54,.1);border-left:3px solid #A73436;color:#8b8fa8;font-size:12px;line-height:1.7">${esc(text)}</p>`
}

// ── Templates ─────────────────────────────────────────────────

const t = {

  welcome: (name) => ({
    subject: 'Bienvenido a NORIA Creative Film Studio',
    html: layout('Bienvenido', `
      ${heading(`Bienvenido, ${name}`)}
      ${subtext('Tu cuenta ha sido creada exitosamente en NORIA Creative Film Studio.')}
      <p style="color:#F3F3F1;font-size:14px;line-height:1.7;margin:0 0 16px">
        Ya puedes iniciar sesión para explorar nuestros servicios de producción audiovisual y generar cotizaciones.
      </p>
      ${notice('Si no solicitaste esta cuenta, puedes ignorar este correo de forma segura.')}
    `),
  }),

}

module.exports = { send, t }
