# Sistema de Correos y WhatsApp — NORIA Creative Film Studio

El correo se usa hoy únicamente para el mensaje de bienvenida al registrarse. El contacto y las cotizaciones se manejan por WhatsApp (ver sección abajo).

---

## Correo — Configuración

El sistema usa **Nodemailer** con Gmail SMTP. Si las variables `MAIL_HOST`, `MAIL_USER` y `MAIL_PASS` están configuradas en `server/.env`, los correos se envían realmente. Si faltan, el servidor entra en **modo simulado**: imprime el destino y asunto en consola sin crashear.

```env
MAIL_HOST=smtp.gmail.com
MAIL_PORT=587
MAIL_USER=nexus.sotech@gmail.com
MAIL_PASS=xxxx xxxx xxxx xxxx   # App Password de Gmail (requiere 2FA)
```

Remitente siempre: `"NORIA Creative Film Studio" <MAIL_USER>`

### Bienvenida al registrar cuenta

| Campo | Valor |
|-------|-------|
| Destinatario | Usuario que se registró |
| Trigger | `POST /api/auth/register` exitoso |
| Template | `t.welcome(name)` |
| Variables | `name` — nombre completo del usuario |
| Asunto | `Bienvenido a NORIA Creative Film Studio` |

**Contenido:** Saludo personalizado, confirmación de que la cuenta fue creada, instrucciones para iniciar sesión.

### Modo simulado

Si `MAIL_PASS` (o cualquiera de las tres variables SMTP) no está configurada, `nodemailer` no se instancia. En su lugar, la función `send()` imprime en consola:

```
[EMAIL SIMULADO] → destinatario@ejemplo.com | Asunto del correo
```

Implementado en `server/src/services/email.service.js` mediante `layout()`, `heading()`, `subtext()` y `notice()`.

---

## WhatsApp — Contacto y cotizaciones

Reemplaza al correo transaccional que existía antes para estos dos flujos. No usa ninguna API ni cuenta externa: son links `https://wa.me/<numero>?text=<mensaje>` que abren WhatsApp con el mensaje ya redactado. Helper compartido: `openWhatsApp()` / `openWhatsAppAdmin()` en `client/src/lib/whatsapp.ts` y `admin/src/lib/whatsapp.ts`.

Número del negocio: variable `VITE_WHATSAPP_NUMBER` en `client/.env` / `client/.env.production`.

### Flujo cliente → admin

| Origen | Trigger | Qué pasa |
|--------|---------|----------|
| Formulario de contacto (`Contact.tsx`) | Envío exitoso de `POST /api/contact` | Se abre WhatsApp del usuario con los datos del mensaje, dirigido al número del negocio |
| Cotización nueva (`Quote.tsx`) | Botón "Enviar por WhatsApp" en la pantalla de éxito, tras `POST /api/quotes` | Se abre WhatsApp con el desglose de la cotización |
| Cotización guardada (`MyQuotes.tsx`) | Botón "Seguimiento por WhatsApp" en cada tarjeta | Igual que arriba, para retomar una cotización anterior |

El teléfono es obligatorio tanto en el registro de usuario como en el formulario de contacto, para que el dato quede siempre disponible.

### Flujo admin → cliente (respaldo manual)

Como el envío real ocurre en el WhatsApp del usuario (fuera del control del backend), no hay forma de confirmar que se completó. El panel admin conserva un botón equivalente como respaldo, basado en los datos ya guardados en base de datos:

| Panel | Botón | Comportamiento |
|-------|-------|-----------------|
| Mensajes (`Messages.tsx`) | "Seguimiento por WhatsApp" | Abre chat con el teléfono del mensaje y marca el mensaje como `answered` (`PATCH /api/contact/:id/status`) |
| Cotizaciones (`Quotes.tsx`) | "WhatsApp" | Abre chat con el teléfono del usuario dueño de la cotización |

Si el registro no tiene teléfono (mensajes/usuarios previos a este cambio), el botón aparece deshabilitado.
