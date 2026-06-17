const nodemailer = require('nodemailer')
const env = require('../config/env')

const configured = !!(env.MAIL_USER && env.MAIL_PASS && env.MAIL_HOST)

const transporter = configured
  ? nodemailer.createTransport({
      host: env.MAIL_HOST, port: env.MAIL_PORT, secure: false,
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

// ── Tabla de datos ────────────────────────────────────────────

function dataTable(rows) {
  const cells = rows.map(([label, value]) => `
    <tr>
      <td style="padding:10px 16px;color:#8b8fa8;font-size:12px;text-transform:uppercase;letter-spacing:.05em;white-space:nowrap;width:40%;border-bottom:1px solid #2a2d3a">${label}</td>
      <td style="padding:10px 16px;color:#F3F3F1;font-size:14px;border-bottom:1px solid #2a2d3a">${value}</td>
    </tr>`).join('')
  return `<table style="width:100%;border-collapse:collapse;background:#111420;border:1px solid #2a2d3a;border-radius:3px;margin:20px 0">${cells}</table>`
}

function heading(text) {
  return `<h2 style="margin:0 0 8px;color:#F3F3F1;font-size:18px;font-weight:700">${text}</h2>`
}

function subtext(text) {
  return `<p style="margin:0 0 24px;color:#8b8fa8;font-size:14px;line-height:1.6">${text}</p>`
}

function notice(text) {
  return `<p style="margin:20px 0 0;padding:12px 16px;background:rgba(167,52,54,.1);border-left:3px solid #A73436;color:#8b8fa8;font-size:12px;line-height:1.7">${text}</p>`
}

// ── Templates ─────────────────────────────────────────────────

const t = {

  welcome: (name) => ({
    subject: 'Bienvenido a NORIA Creative Film Studio',
    html: layout('Bienvenido', `
      ${heading(`Bienvenido, ${name}`)}
      ${subtext('Tu cuenta ha sido creada exitosamente en NORIA Creative Film Studio.')}
      <p style="color:#F3F3F1;font-size:14px;line-height:1.7;margin:0 0 16px">
        Ya puedes iniciar sesión para explorar nuestros servicios de producción audiovisual, generar cotizaciones y agendar citas con nuestro equipo.
      </p>
      ${notice('Si no solicitaste esta cuenta, puedes ignorar este correo de forma segura.')}
    `),
  }),

  quoteCreated: (name, service, quoteCode, breakdown) => ({
    subject: `Cotización ${quoteCode} — ${service}`,
    html: layout('Cotización generada', `
      ${heading('Cotización generada')}
      ${subtext(`Estimado/a ${name}, hemos registrado tu solicitud de cotización para el siguiente servicio.`)}
      ${dataTable([
        ['Número de cotización', quoteCode || '—'],
        ['Servicio', service],
        ['Precio base', breakdown ? `$${Number(breakdown.base_price).toLocaleString('es-MX')} MXN` : '—'],
        ['Duración del rodaje', breakdown ? `$${Number(breakdown.production_cost).toLocaleString('es-MX')} MXN` : '—'],
        ['Equipo adicional', breakdown ? `$${Number(breakdown.equipment_cost).toLocaleString('es-MX')} MXN` : '—'],
        ['Tiempo de entrega', breakdown ? `$${Number(breakdown.postproduction_cost).toLocaleString('es-MX')} MXN` : '—'],
        ['Total estimado', breakdown ? `$${Number(breakdown.estimated_price).toLocaleString('es-MX')} MXN` : '—'],
      ])}
      ${notice('Esta cotización es aproximada y puede variar según la logística y necesidades específicas del proyecto. Nuestro equipo se pondrá en contacto para afinar los detalles.')}
    `),
  }),

  quoteNotifyAdmin: (name, service, email, quoteCode) => ({
    subject: `Nueva cotización ${quoteCode || ''} — ${service}`,
    html: layout('Nueva cotización', `
      ${heading('Nueva cotización registrada')}
      ${subtext('Se ha generado una nueva cotización en el sistema.')}
      ${dataTable([
        ['Número de cotización', quoteCode || '—'],
        ['Usuario', name],
        ['Correo', email || '—'],
        ['Servicio', service],
      ])}
      <p style="color:#8b8fa8;font-size:13px;margin:16px 0 0">Accede al panel de administración para revisar el detalle completo.</p>
    `),
  }),

  appointmentBooked: (name, date, start, end, type, service, price, phone, notes) => ({
    subject: `Cita agendada — ${date}`,
    html: layout('Cita agendada', `
      ${heading('Cita agendada exitosamente')}
      ${subtext(`Estimado/a ${name}, tu cita ha sido registrada en nuestro sistema.`)}
      ${dataTable([
        ['Servicio', service || '—'],
        ['Fecha', date],
        ['Hora', `${start} – ${end}`],
        ['Modalidad', type === 'virtual' ? 'Virtual (videollamada)' : 'Presencial (estudio)'],
        ['Total estimado', price ? `$${Number(price).toLocaleString('es-MX')} MXN` : '—'],
        ['Teléfono de contacto', phone || '—'],
        ...(notes ? [['Notas', notes]] : []),
      ])}
      ${notice('Te enviaremos un recordatorio 24 horas antes de tu cita. Si necesitas cancelar o reagendar, comunícate con nosotros con anticipación.')}
    `),
  }),

  appointmentNotifyAdmin: (name, email, date, start, type, service, price, phone, notes) => ({
    subject: `Nueva cita agendada — ${name}`,
    html: layout('Nueva cita', `
      ${heading('Nueva cita agendada')}
      ${subtext('Un usuario ha agendado una cita a través del sistema.')}
      ${dataTable([
        ['Usuario', name],
        ['Correo', email],
        ['Teléfono', phone || '—'],
        ['Servicio', service || '—'],
        ['Fecha', date],
        ['Hora', start],
        ['Modalidad', type === 'virtual' ? 'Virtual' : 'Presencial'],
        ['Total estimado', price ? `$${Number(price).toLocaleString('es-MX')} MXN` : '—'],
        ...(notes ? [['Notas', notes]] : []),
      ])}
    `),
  }),

  appointmentReminder: (name, date, start, type, service) => ({
    subject: `Recordatorio de cita — ${date}`,
    html: layout('Recordatorio de cita', `
      ${heading('Recordatorio de cita')}
      ${subtext(`Estimado/a ${name}, le recordamos que tiene una cita programada.`)}
      ${dataTable([
        ['Servicio', service || '—'],
        ['Fecha', date],
        ['Hora', start],
        ['Modalidad', type === 'virtual' ? 'Virtual (videollamada)' : 'Presencial (estudio)'],
      ])}
      ${notice('Si necesita cancelar o modificar su cita, comuníquese con nosotros a la brevedad posible.')}
    `),
  }),

  contactAck: (name) => ({
    subject: 'Mensaje recibido — NORIA Creative Film Studio',
    html: layout('Mensaje recibido', `
      ${heading('Hemos recibido su mensaje')}
      ${subtext(`Estimado/a ${name}, gracias por comunicarse con nosotros.`)}
      <p style="color:#F3F3F1;font-size:14px;line-height:1.7;margin:0 0 16px">
        Su mensaje ha sido registrado correctamente. Un miembro de nuestro equipo revisará su consulta y se pondrá en contacto con usted a la brevedad.
      </p>
      ${notice('Tiempo de respuesta habitual: 24 a 48 horas hábiles.')}
    `),
  }),

  contactReply: (name, originalSubject, replyText) => ({
    subject: `RE: ${originalSubject} — NORIA Creative Film Studio`,
    html: layout('Respuesta a su consulta', `
      ${heading('Respuesta a su consulta')}
      ${subtext(`Estimado/a ${name}, nuestro equipo le responde a su mensaje.`)}
      <div style="margin:16px 0;padding:16px;background:#111420;border:1px solid #2a2d3a;border-radius:3px">
        <p style="margin:0 0 8px;color:#8b8fa8;font-size:11px;text-transform:uppercase;letter-spacing:.05em">Respuesta de NORIA Creative Film Studio</p>
        <p style="margin:0;color:#F3F3F1;font-size:14px;line-height:1.75;white-space:pre-wrap">${replyText}</p>
      </div>
      ${notice('Si tiene más preguntas, no dude en contactarnos nuevamente a través de nuestro formulario de contacto.')}
    `),
  }),

  contactNotifyAdmin: (name, subject, email, phone, message) => ({
    subject: `Nuevo mensaje de contacto — ${subject}`,
    html: layout('Nuevo mensaje', `
      ${heading('Nuevo mensaje de contacto')}
      ${subtext('Se ha recibido un nuevo mensaje a través del formulario de contacto.')}
      ${dataTable([
        ['Nombre', name],
        ['Correo', email],
        ['Teléfono', phone || '—'],
        ['Asunto', subject],
      ])}
      <div style="margin:16px 0;padding:16px;background:#111420;border:1px solid #2a2d3a;border-radius:3px">
        <p style="margin:0 0 8px;color:#8b8fa8;font-size:11px;text-transform:uppercase;letter-spacing:.05em">Mensaje</p>
        <p style="margin:0;color:#F3F3F1;font-size:14px;line-height:1.7;white-space:pre-wrap">${message}</p>
      </div>
    `),
  }),

}

module.exports = { send, t }
