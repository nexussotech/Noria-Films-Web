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
| `users` | Usuarios con soft-delete (status active/inactive) |
| `services` | Catálogo de servicios gestionado por admin |
| `quotes` | Cotizaciones de usuarios |
| `contact_messages` | Mensajes del formulario público |
