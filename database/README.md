# Base de datos — NORIA Films

## Requisitos
- MySQL 8+ instalado y corriendo

## Setup inicial

```bash
# 1. Entrar a MySQL con tu usuario/password
mysql -u root -p

# 2. Ejecutar schema (crea la BD y las 4 tablas)
SOURCE /ruta/al/proyecto/noria-films/database/schema.sql;

# 3. Ejecutar seed (admin + 8 servicios)
SOURCE /ruta/al/proyecto/noria-films/database/seed.sql;

# 4. Verificar
USE noria_films;
SHOW TABLES;
SELECT id, full_name, email, role FROM users;
SELECT id, name, base_price FROM services;
```

## Configurar .env del servidor

```env
DB_HOST=localhost
DB_PORT=3306
DB_USER=root
DB_PASSWORD=tu_password_aqui
DB_NAME=noria_films
```

## Credenciales admin del seed

| Campo | Valor |
|-------|-------|
| Email | admin@noriafilms.com |
| Password | Admin1234! |

**IMPORTANTE:** Cambiar la contraseña del admin después del primer login en producción.

## Tablas

| Tabla | Propósito |
|-------|-----------|
| `users` | Usuarios con soft-delete (status active/inactive), teléfono único |
| `services` | Catálogo de servicios gestionado por admin |
| `quotes` | Cotizaciones de usuarios |
| `contact_messages` | Mensajes del formulario público |

## Migraciones

Aplicar en orden sobre una base ya existente (una instalación nueva con `schema.sql` ya las incluye todas):

| Archivo | Qué hace |
|---------|----------|
| `migration_v2.sql` | Limpieza de datos de prueba, columnas iniciales de `quotes`, catálogo real de servicios |
| `migration_v3.sql` | Íconos de servicios a códigos de texto |
| `migration_v4.sql` | Agrega `quote_code` a `quotes` y `answered` al enum de `contact_messages` (columnas que después se revirtieron en v6/v7) |
| `migration_v5.sql` | Elimina el sistema de agendamiento de citas (appointments/availability_slots/blocked_dates/appointment_reminders) y el estado `scheduled` de `quotes` |
| `migration_v6.sql` | Reafirma `answered` en el enum de `contact_messages.status` (usado por "Seguimiento por WhatsApp" del panel admin) |
| `migration_v7.sql` | Elimina columnas huérfanas de `quotes` sin uso en el código (`quote_code`, `duration`, `locations`, `deliverables`) |
| `migration_v8.sql` | Teléfono único por cuenta (`UNIQUE` en `users.phone`) — si hay duplicados, resolverlos antes de correrla |
