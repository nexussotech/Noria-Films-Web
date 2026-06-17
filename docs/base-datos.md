# Base de Datos — NORIA Creative Film Studio

Motor: **MySQL 9.0.1** · Charset: `utf8mb4_unicode_ci` · DB: `noria_films`

---

## Diagrama de tablas

```
┌──────────────────┐      ┌──────────────────────┐
│      users       │      │       services       │
├──────────────────┤      ├──────────────────────┤
│ id  PK           │      │ id  PK               │
│ full_name        │      │ name                 │
│ email  UNIQUE    │      │ description          │
│ password_hash    │      │ base_price           │
│ phone            │      │ icon                 │
│ role  ENUM       │      │ image_url            │
│ status  ENUM     │      │ active  TINYINT      │
│ created_at       │      │ created_at           │
└────────┬─────────┘      └──────────┬───────────┘
         │                           │
         │ 1:N                       │ 1:N
         ▼                           ▼
┌──────────────────────────────────────────────────┐
│                     quotes                       │
├──────────────────────────────────────────────────┤
│ id  PK                                           │
│ user_id  FK → users.id                           │
│ service_id  FK → services.id                     │
│ shooting_duration  VARCHAR                       │
│ needs_drone  TINYINT                             │
│ delivery_time  VARCHAR                           │
│ project_type                                     │
│ extra_notes                                      │
│ production_cost  DECIMAL                         │
│ equipment_cost  DECIMAL                          │
│ postproduction_cost  DECIMAL                     │
│ extras_cost  DECIMAL                             │
│ estimated_price  DECIMAL                         │
│ status  ENUM(draft/generated/scheduled/cancelled)│
│ created_at                                       │
└──────────────────┬───────────────────────────────┘
                   │ 1:1
                   ▼
┌──────────────────────────────────────────────────┐
│                  appointments                    │
├──────────────────────────────────────────────────┤
│ id  PK                                           │
│ user_id  FK → users.id                           │
│ quote_id  FK → quotes.id                         │
│ slot_id  FK → availability_slots.id  UNIQUE      │
│ appointment_date  DATE                           │
│ start_time / end_time  TIME                      │
│ status  ENUM(pending/confirmed/cancelled/completed)│
│ meeting_type  ENUM(presencial/virtual)           │
│ notes  TEXT                                      │
│ created_at                                       │
└──────────────────┬───────────────────────────────┘
                   │ 1:N
                   ▼
┌─────────────────────────────────┐
│      appointment_reminders      │
├─────────────────────────────────┤
│ id  PK                          │
│ appointment_id  FK              │
│ reminder_type  ENUM(24h/1h)     │
│ send_at  DATETIME               │
│ sent_at  DATETIME               │
│ status  ENUM(pending/sent/failed)│
└─────────────────────────────────┘

┌─────────────────────────────┐     ┌──────────────────────────┐
│     availability_slots      │     │      blocked_dates       │
├─────────────────────────────┤     ├──────────────────────────┤
│ id  PK                      │     │ id  PK                   │
│ date  DATE                  │     │ date  DATE  UNIQUE       │
│ start_time  TIME            │     │ reason  VARCHAR          │
│ end_time  TIME              │     │ created_by_admin_id  FK  │
│ is_available  TINYINT       │     │ created_at               │
│ created_by_admin_id  FK     │     └──────────────────────────┘
│ UNIQUE(date, start_time)    │
└─────────────────────────────┘

┌──────────────────────────────────┐
│        contact_messages          │
├──────────────────────────────────┤
│ id  PK                           │
│ full_name / email / phone        │
│ subject / message                │
│ status  ENUM(new/read/archived)  │
│ created_at                       │
└──────────────────────────────────┘
```

---

## Relaciones

| Relación | Cardinalidad | Descripción |
|----------|-------------|-------------|
| `users` → `quotes` | 1:N | Un usuario puede tener múltiples cotizaciones |
| `services` → `quotes` | 1:N | Un servicio puede aparecer en múltiples cotizaciones |
| `quotes` → `appointments` | 1:1 | Una cotización tiene máximo una cita (`UNIQUE slot_id`) |
| `users` → `appointments` | 1:N | Un usuario puede tener múltiples citas históricas |
| `availability_slots` → `appointments` | 1:1 | Un slot solo puede ser ocupado por una cita (`UNIQUE slot_id`) |
| `appointments` → `appointment_reminders` | 1:N | Una cita puede tener múltiples recordatorios (24h, 1h) |
| `users` → `availability_slots` | admin crea | `created_by_admin_id` registra quién creó el slot |

---

## CRUD por tabla

### `users`
| Operación | Cuándo | Endpoint |
|-----------|--------|----------|
| CREATE | Registro de nuevo usuario | `POST /api/auth/register` |
| READ | Login, perfil, lista admin | `GET /api/auth/me`, `GET /api/users` |
| UPDATE | Actualizar perfil, cambiar status | `PUT /api/auth/me`, `PATCH /api/users/:id/status` |
| DELETE | No implementado (solo desactivar) | — |

### `services`
| Operación | Cuándo | Endpoint |
|-----------|--------|----------|
| CREATE | Admin crea servicio nuevo | `POST /api/services` |
| READ | Landing pública + admin | `GET /api/services` |
| UPDATE | Admin edita nombre/precio/estado | `PUT /api/services/:id` |
| DELETE | Admin elimina servicio | `DELETE /api/services/:id` |

### `quotes`
| Operación | Cuándo | Endpoint |
|-----------|--------|----------|
| CREATE | Usuario completa formulario de cotización | `POST /api/quotes` |
| READ | Usuario ve sus cotizaciones, admin ve todas | `GET /api/quotes/my`, `GET /api/quotes` |
| UPDATE | Admin cambia estado (cancel, schedule) | `PATCH /api/quotes/:id/status` |
| DELETE | No implementado | — |

### `availability_slots`
| Operación | Cuándo | Endpoint |
|-----------|--------|----------|
| CREATE | Admin define horario disponible | `POST /api/admin/availability` |
| READ | Usuario ve slots al agendar, admin gestiona | `GET /api/appointments/available-slots` |
| DELETE | Admin elimina slot | `DELETE /api/admin/availability/:id` |

### `appointments`
| Operación | Cuándo | Endpoint |
|-----------|--------|----------|
| CREATE | Usuario agenda cita (transacción con FOR UPDATE) | `POST /api/appointments` |
| READ | Usuario ve sus citas, admin ve todas | `GET /api/appointments/my`, `GET /api/appointments` |
| UPDATE | Admin cambia estado (confirm, complete, cancel) | `PATCH /api/appointments/:id/status` |
| DELETE | No implementado | — |

### `contact_messages`
| Operación | Cuándo | Endpoint |
|-----------|--------|----------|
| CREATE | Visitante envía formulario de contacto | `POST /api/contact` |
| READ | Admin revisa mensajes | `GET /api/contact` |
| UPDATE | Admin marca leído/archivado | `PATCH /api/contact/:id/status` |
| DELETE | No implementado | — |

---

## Notas técnicas

- **Contraseñas**: almacenadas como hash bcrypt, nunca en texto plano.
- **Race condition**: el agendamiento usa `BEGIN TRANSACTION` + `SELECT ... FOR UPDATE` para garantizar que dos requests simultáneas no reserven el mismo slot.
- **Fechas**: el pool de mysql2 usa `timezone: '+00:00'`; las consultas usan `DATE_FORMAT(col,'%Y-%m-%d')` para devolver strings consistentes.
- **Soft delete**: usuarios no se eliminan, se marcan `status='inactive'`.
