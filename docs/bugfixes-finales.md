# Correcciones Finales — NORIA Creative Film Studio

> Registro de errores encontrados durante la fase de QA, su causa raíz y la solución aplicada.

> **Nota:** varias entradas de este registro histórico referencian el sistema de agendamiento de citas (`appointments`, `availability_slots`, `reminder.cron.js`, `client/src/pages/Schedule`). Ese módulo fue eliminado del proyecto (ver `migration_v5.sql`); se conserva el registro tal como se documentó en su momento.

---

## Bugs críticos

| # | Error | Archivo | Causa | Solución | Verificación |
|---|-------|---------|-------|----------|--------------|
| B01 | Slots del día actual con hora pasada aparecían en el calendario | `server/src/controllers/appointments.controller.js` | La query filtraba `sl.date >= CURDATE()` sin validar la hora; un slot de las 10:00 seguía visible a las 15:00 | Cambiar a `(sl.date > CURDATE() OR (sl.date = CURDATE() AND sl.start_time > CURTIME()))` | Slots expirados ya no se muestran al cliente |
| B02 | Recordatorios se enviaban aunque la cita fuera cancelada | `server/src/controllers/appointments.controller.js` | Al cancelar una cita, los registros en `appointment_reminders` con `status='pending'` no se actualizaban | Agregar `UPDATE appointment_reminders SET status='failed' WHERE appointment_id=? AND status='pending'` en el branch de cancelación | Cron no procesa recordatorios de citas canceladas |
| B03 | Firmas de email templates incompatibles con los callers | `server/src/services/email.service.js` + controllers | Al reescribir los templates HTML con firmas expandidas, los controllers seguían llamando con la firma antigua (menos argumentos) | Actualizar llamadas en `quotes.controller.js`, `contact.controller.js` y `reminder.cron.js` para pasar todos los parámetros requeridos | Builds limpios; correos muestran información completa |
| B04 | Recordatorio de cita no incluía el nombre del servicio | `server/src/services/reminder.cron.js` | La query del cron no hacía JOIN con `quotes` ni `services`, por lo que no podía pasar el nombre del servicio al template | Agregar `JOIN quotes q ON q.id = a.quote_id` y `JOIN services s ON s.id = q.service_id`, seleccionar `s.name AS service_name` | El email de recordatorio muestra correctamente el servicio |

---

## Bugs menores

| # | Error | Archivo | Causa | Solución | Verificación |
|---|-------|---------|-------|----------|--------------|
| B05 | Guard `if (env.MAIL_USER)` para notificación al admin enviaba a destino nulo | `quotes.controller.js`, `contact.controller.js` | La condición correcta para enviar al admin es que `CLIENT_EMAIL_TO` esté configurado, no `MAIL_USER` | Cambiar guard a `if (env.CLIENT_EMAIL_TO)` | Notificaciones al admin se envían correctamente |
| B06 | Emojis en UI de cotizador (🚁, 🎥, ⚠) | `client/src/pages/Quote/Quote.tsx` | Iconos decorativos usaban emoji directamente en JSX | Eliminar spans de emoji de las opciones de dron; reemplazar ⚠ por texto plano en el aviso | Build limpio; no hay emojis renderizados |
| B07 | Emojis en selector de modalidad de cita (💻, 📍) | `client/src/pages/Schedule/Schedule.tsx` | Spans de meetIcon con emoji | Eliminar los spans de ícono; la etiqueta y descripción son suficientemente descriptivos | Build limpio |
| B08 | Emojis en sección de contacto (✉, 📞, 📍, ✅, ❌) | `client/src/pages/Home/sections/Contact/Contact.tsx` | Iconos de info y estados de formulario usaban emoji | Reemplazar íconos de info con caracteres texto (@, T, Ags); eliminar emoji de mensajes de estado | Build limpio |
| B09 | Emoji en SOCIALS de datos estáticos (📸, ✉) | `client/src/data/index.ts` | Íconos de redes sociales usaban emoji | Reemplazar con 'IG' y '@' | Footer renderiza correctamente |
| B10 | Emoji fallback en grid de servicios admin (🎬) | `admin/src/pages/Services/Services.tsx` | Fallback para ícono nulo usaba emoji | Cambiar a '—' | Admin muestra dash en lugar de emoji |
| B11 | Íconos de servicios en DB eran emojis (📱, 📸, 🎵, 💃, 📺, 🎤, 🏢, 🎞) | `database/seed.sql`, registros en `services` | Seed original usaba emoji como código de ícono | Actualizar seed con códigos de texto (RS, SF, VC, VD, CM, EV, VI, CT); crear `migration_v3.sql` y aplicar a BD existente | `SELECT icon FROM services` devuelve solo texto |

---

## Bloque 10 — Correcciones y mejoras (2026-06-01)

| # | Error / Mejora | Archivo | Solución |
|---|----------------|---------|----------|
| B17 | Recordatorio enviado para cita ya pasada | `reminder.cron.js` | Agregar filtro `AND a.appointment_date >= CURDATE()` y `AND a.status IN ('pending','confirmed')` |
| B18 | Recordatorio no llegó para cita creada recientemente | `reminder.cron.js` | El bug era el mismo que B17 — si el server tenía downtime, procesaba reminders atrasados para citas pasadas pero ignoraba los recientes por no tener logs. Ahora hay logging detallado |
| B19 | Notificación admin de cotización sin quote_code | `quotes.controller.js`, `email.service.js` | Generar `quote_code` (formato NOR-ICONO-NNNN) después de INSERT, pasarlo a los templates |
| B20 | Crear horario admin en fecha pasada no daba error en backend | `admin.controller.js` | Agregar validación: si `date < today` → 400 Bad Request |

---

## Bugs previos (sesiones anteriores)

| # | Error | Archivo | Causa | Solución |
|---|-------|---------|-------|----------|
| B12 | `INSERT INTO quotes` faltaba placeholder `?` para `estimated_price` | `quotes.controller.js` | Columna `estimated_price` en la lista pero no en los values | Agregar el valor correspondiente en el array de params |
| B13 | Columnas DATE de mysql2 devuelven objetos JS Date, no strings | Múltiples controllers | mysql2 con `dateStrings: false` (default) convierte DATE a Date objects | Usar `DATE_FORMAT(col, '%Y-%m-%d')` en SQL o `.toISOString().slice(0,10)` en JS |
| B14 | Double-HAVING producía error SQL en users.controller.js | `users.controller.js` | Query dinámica concatenaba dos cláusulas HAVING en lugar de AND | Consolidar condiciones HAVING con AND |
| B15 | Fragment con key prop en Quotes.tsx admin | `admin/src/pages/Quotes/Quotes.tsx` | Fragment `<>` no acepta key; se necesita `<React.Fragment key>` | Reemplazar `<>` con `<React.Fragment key={q.id}>` |
| B16 | Ruta `/servicios` faltante en admin App.tsx | `admin/src/App.tsx` | La ruta no estaba registrada | Agregar `<Route path="servicios" element={<Services />} />` |
