# Endpoints API — NORIA Creative Film Studio

Base URL: `http://localhost:4000/api`

Autenticación: `Authorization: Bearer <JWT>`  
Roles: `user` (usuario registrado), `admin` (panel de administración)

---

## Auth — `/api/auth`

| Método | Ruta | Rol | Descripción | Body esperado | Respuesta |
|--------|------|-----|-------------|---------------|-----------|
| POST | `/auth/register` | Público | Registra nuevo usuario | `{ full_name, email, password, phone? }` | `201 { token, user: { id, full_name, email, role } }` |
| POST | `/auth/login` | Público | Inicia sesión | `{ email, password }` | `200 { token, user: { id, full_name, email, role } }` |
| GET | `/auth/me` | user/admin | Perfil del usuario autenticado | — | `200 { id, full_name, email, phone, role, status }` |
| PUT | `/auth/me` | user/admin | Actualiza nombre de perfil | `{ full_name }` | `200 { message }` |

---

## Services — `/api/services`

| Método | Ruta | Rol | Descripción | Body esperado | Respuesta |
|--------|------|-----|-------------|---------------|-----------|
| GET | `/services` | Público | Lista servicios activos (admin ve todos) | — | `200 [ { id, name, description, base_price, icon, active } ]` |
| POST | `/services` | admin | Crea servicio | `{ name, description, base_price?, icon?, image_url?, active? }` | `201 { id, message }` |
| PUT | `/services/:id` | admin | Actualiza servicio | `{ name, description, base_price?, icon?, image_url?, active }` | `200 { message }` |
| DELETE | `/services/:id` | admin | Elimina servicio | — | `200 { message }` |

---

## Quotes — `/api/quotes`

| Método | Ruta | Rol | Descripción | Body esperado | Respuesta |
|--------|------|-----|-------------|---------------|-----------|
| GET | `/quotes/pricing-config` | Público | Costos por opción para preview | — | `200 { SHOOTING_DURATION_COST, DELIVERY_TIME_COST, DRONE_COST }` |
| POST | `/quotes` | user | Crea cotización | `{ service_id, shooting_duration, needs_drone, delivery_time, project_type?, extra_notes? }` | `201 { id, estimated_price, breakdown }` |
| GET | `/quotes/my` | user | Cotizaciones del usuario autenticado | — | `200 [ QuoteRow ]` |
| GET | `/quotes/:id` | user | Detalle de una cotización propia | — | `200 QuoteRow` |
| GET | `/quotes` | admin | Todas las cotizaciones | `?status=draft\|generated\|scheduled\|cancelled` | `200 [ QuoteRow ]` |
| PATCH | `/quotes/:id/status` | admin | Cambia estado de cotización | `{ status }` | `200 { message }` |

**Valores válidos:**
- `shooting_duration`: `1_dia` | `2_dias` | `3_plus`
- `delivery_time`: `3_semanas` | `1_semana` | `2_4_dias`

---

## Appointments — `/api/appointments`

| Método | Ruta | Rol | Descripción | Body esperado | Respuesta |
|--------|------|-----|-------------|---------------|-----------|
| GET | `/appointments/available-slots` | user | Slots disponibles (sin citas, sin bloqueos) | `?date=YYYY-MM-DD` | `200 [ { id, date, start_time, end_time } ]` |
| POST | `/appointments` | user | Agenda cita (transacción con FOR UPDATE) | `{ quote_id, slot_id, meeting_type?, notes? }` | `201 { id, message, appointment }` |
| GET | `/appointments/my` | user | Citas del usuario autenticado | — | `200 [ ApptRow ]` |
| GET | `/appointments` | admin | Todas las citas | `?status=pending\|confirmed\|cancelled\|completed` | `200 [ ApptRow ]` |
| PATCH | `/appointments/:id/status` | admin | Cambia estado de cita | `{ status }` | `200 { message }` |

---

## Contact — `/api/contact`

| Método | Ruta | Rol | Descripción | Body esperado | Respuesta |
|--------|------|-----|-------------|---------------|-----------|
| POST | `/contact` | Público | Envía mensaje de contacto | `{ full_name, email, phone?, subject, message }` | `201 { message }` |
| GET | `/contact` | admin | Lista todos los mensajes | `?status=new\|read\|archived` | `200 [ ContactMsg ]` |
| PATCH | `/contact/:id/status` | admin | Cambia estado de mensaje | `{ status }` | `200 { message }` |

---

## Admin — `/api/admin` (todas requieren admin)

| Método | Ruta | Rol | Descripción | Body esperado | Respuesta |
|--------|------|-----|-------------|---------------|-----------|
| GET | `/admin/dashboard/stats` | admin | Métricas del dashboard | — | `200 { total_users, total_quotes, users_with_quotes, users_with_appointments, conversion_rate, pending_quotes, pending_appointments, today_appointments, new_messages }` |
| GET | `/admin/availability` | admin | Lista slots de disponibilidad | — | `200 [ { id, date, start_time, end_time, is_available } ]` |
| POST | `/admin/availability` | admin | Crea slot de disponibilidad | `{ date, start_time, end_time }` | `201 { id, message }` |
| DELETE | `/admin/availability/:id` | admin | Elimina slot | — | `200 { message }` |
| GET | `/admin/blocked-dates` | admin | Lista fechas bloqueadas | — | `200 [ { id, date, reason } ]` |
| POST | `/admin/blocked-dates` | admin | Bloquea una fecha | `{ date, reason? }` | `201 { id, message }` |
| DELETE | `/admin/blocked-dates/:id` | admin | Desbloquea fecha | — | `200 { message }` |

---

## Users — `/api/users` (todas requieren admin)

| Método | Ruta | Rol | Descripción | Body esperado | Respuesta |
|--------|------|-----|-------------|---------------|-----------|
| GET | `/users` | admin | Lista usuarios | `?search=&hasQuote=true&hasAppointment=true` | `200 [ AdminUser ]` |
| GET | `/users/:id` | admin | Detalle de usuario + historial | — | `200 { user, quotes, appointments }` |
| PATCH | `/users/:id/status` | admin | Activa/desactiva usuario | `{ status: 'active'\|'inactive' }` | `200 { message }` |

---

## Health

| Método | Ruta | Rol | Descripción |
|--------|------|-----|-------------|
| GET | `/health` | Público | Estado del servidor | `200 { status: 'ok', env, ts }` |

---

## Códigos de respuesta

| Código | Significado |
|--------|-------------|
| 200 | OK |
| 201 | Creado exitosamente |
| 400 | Datos inválidos / validación fallida |
| 401 | Sin autenticación o token expirado |
| 403 | Sin permisos (rol insuficiente) |
| 404 | Recurso no encontrado |
| 409 | Conflicto (slot ya ocupado, email duplicado) |
| 500 | Error interno del servidor |
