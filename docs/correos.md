# Sistema de Correos — NORIA Creative Film Studio

Documentación del sistema de emails: cuándo se envían, qué información contienen y cómo opera el modo simulado.

---

## Configuración

El sistema usa **Nodemailer** con Gmail SMTP. Si las variables `MAIL_HOST`, `MAIL_USER` y `MAIL_PASS` están configuradas en `server/.env`, los correos se envían realmente. Si faltan, el servidor entra en **modo simulado**: imprime el destino y asunto en consola sin crashear.

```env
MAIL_HOST=smtp.gmail.com
MAIL_PORT=587
MAIL_USER=nexus.sotech@gmail.com
MAIL_PASS=xxxx xxxx xxxx xxxx   # App Password de Gmail (requiere 2FA)
CLIENT_EMAIL_TO=correo_del_admin@gmail.com
```

Remitente siempre: `"NORIA Creative Film Studio" <MAIL_USER>`

---

## Tipos de correo

### 1. Bienvenida al registrar cuenta

| Campo | Valor |
|-------|-------|
| Destinatario | Usuario que se registró |
| Trigger | `POST /api/auth/register` exitoso |
| Template | `t.welcome(name)` |
| Variables | `name` — nombre completo del usuario |
| Asunto | `Bienvenido a NORIA Creative Film Studio` |

**Contenido:** Saludo personalizado, confirmación de que la cuenta fue creada, instrucciones para iniciar sesión.

---

### 2. Confirmación de cotización — al usuario

| Campo | Valor |
|-------|-------|
| Destinatario | Usuario que generó la cotización |
| Trigger | `POST /api/quotes` exitoso |
| Template | `t.quoteCreated(name, service, breakdown)` |
| Variables | `name`, `service` (nombre del servicio), `breakdown` (objeto con `base_price`, `production_cost`, `equipment_cost`, `postproduction_cost`, `estimated_price`) |
| Asunto | `Cotización generada — {service}` |

**Contenido:** Tabla con desglose completo de costos (base, duración de rodaje, equipo adicional, tiempo de entrega, total). Aviso de que el precio es aproximado.

---

### 3. Notificación de cotización — al administrador

| Campo | Valor |
|-------|-------|
| Destinatario | `CLIENT_EMAIL_TO` (email del estudio) |
| Trigger | `POST /api/quotes` exitoso, si `CLIENT_EMAIL_TO` está configurado |
| Template | `t.quoteNotifyAdmin(name, service, email)` |
| Variables | `name`, `service`, `email` (correo del usuario) |
| Asunto | `Nueva cotización registrada — {service}` |

**Contenido:** Nombre del usuario, correo de contacto y servicio solicitado. Enlace implícito al panel de admin para revisar el detalle.

---

### 4. Acuse de contacto — al remitente

| Campo | Valor |
|-------|-------|
| Destinatario | Persona que llenó el formulario de contacto |
| Trigger | `POST /api/contact` exitoso |
| Template | `t.contactAck(name)` |
| Variables | `name` — nombre del remitente |
| Asunto | `Mensaje recibido — NORIA Creative Film Studio` |

**Contenido:** Confirmación de que el mensaje fue recibido. Tiempo de respuesta estimado: 24 a 48 horas hábiles.

---

### 5. Respuesta del admin a mensaje de contacto

| Campo | Valor |
|-------|-------|
| Destinatario | Persona que envió el mensaje original |
| Trigger | `POST /api/admin/contact/:id/reply` desde el panel admin |
| Template | `t.contactReply(name, originalSubject, replyText)` |
| Variables | Nombre del remitente, asunto original, texto de respuesta |
| Asunto | `RE: {originalSubject} — NORIA Creative Film Studio` |

**Contenido:** Respuesta escrita por el admin en caja estilizada. El status del mensaje cambia a `answered`.

---

### 6. Notificación de contacto — al administrador

| Campo | Valor |
|-------|-------|
| Destinatario | `CLIENT_EMAIL_TO` |
| Trigger | `POST /api/contact` exitoso, si `CLIENT_EMAIL_TO` está configurado |
| Template | `t.contactNotifyAdmin(name, subject, email, phone, message)` |
| Variables | Nombre, asunto, email, teléfono (opcional), mensaje completo |
| Asunto | `Nuevo mensaje de contacto — {subject}` |

**Contenido:** Tabla con datos del remitente y cuerpo completo del mensaje para respuesta directa.

---

## Modo simulado

Si `MAIL_PASS` (o cualquiera de las tres variables SMTP) no está configurada, `nodemailer` no se instancia. En su lugar, la función `send()` imprime en consola:

```
[EMAIL SIMULADO] → destinatario@ejemplo.com | Asunto del correo
```

El servidor no crashea y el flujo de negocio continúa normalmente. Útil para desarrollo local sin credenciales SMTP.

---

## Diseño de los templates

Todos los correos comparten la misma arquitectura visual:

- Fondo oscuro `#0f1117`, superficie `#1a1d27`
- Cabecera roja `#A73436` con nombre del estudio
- Tablas de datos con etiqueta en gris y valor en crema `#F3F3F1`
- Avisos con borde izquierdo rojo para notas importantes
- Pie con aviso de correo automático

Implementados en `server/src/services/email.service.js` mediante las funciones auxiliares `layout()`, `dataTable()`, `heading()`, `subtext()` y `notice()`.
