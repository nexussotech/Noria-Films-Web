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
│ status  ENUM(draft/generated/cancelled)          │
│ created_at                                       │
└───────────────────────────────────────────────────┘

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
| UPDATE | Admin cambia estado (draft/generated/cancelled) | `PATCH /api/quotes/:id/status` |
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
- **Fechas**: el pool de mysql2 usa `timezone: '+00:00'`; las consultas usan `DATE_FORMAT(col,'%Y-%m-%d')` para devolver strings consistentes.
- **Soft delete**: usuarios no se eliminan, se marcan `status='inactive'`.
