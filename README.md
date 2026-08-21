# NORIA Creative Film Studio

Plataforma web para una empresa de producción audiovisual. Permite a visitantes conocer los servicios, a usuarios registrados solicitar cotizaciones, y a administradores gestionar todo desde un panel independiente.

> Proyecto escolar final · Stack: React 18 + TypeScript + Node.js + Express + MySQL

---

## Cambios recientes — Contacto y cotizaciones por WhatsApp

El formulario de contacto y el flujo de cotización dejaron de usar correo transaccional (confirmación al usuario, notificación al admin, respuesta desde el panel) y ahora usan **WhatsApp** vía links `wa.me` — sin API ni servicio externo, sin costo:

- **Cliente → admin**: al enviar el formulario de contacto o generar/dar seguimiento a una cotización, se abre WhatsApp del usuario con el mensaje ya redactado hacia el número del negocio (`VITE_WHATSAPP_NUMBER`).
- **Admin → cliente**: en los paneles de Mensajes y Cotizaciones hay un botón "Seguimiento por WhatsApp" que abre el chat con el teléfono del cliente (respaldo manual, ya que no hay forma de confirmar que el cliente completó su propio envío).
- El teléfono es **obligatorio y único por cuenta** (registro y formulario de contacto) — antes era opcional y se podía repetir entre usuarios.
- El correo (Nodemailer + Gmail SMTP) se conserva solo para el mensaje de bienvenida al registrarse.
- Se corrigieron bugs de esta migración: rate limiter que bloqueaba al admin en su propio panel (estaba pensado solo para el POST público de contacto), formato de número al armar el link `wa.me` (dígitos limpios + prefijo `52` si falta código de país), y estado `answered` faltante en el schema.
- Se aprovechó para reconciliar deriva de esquema acumulada de sesiones anteriores: se aplicaron migraciones pendientes (agendamiento de citas nunca eliminado de la BD, columnas huérfanas en `quotes`) — ver `database/README.md`.

Detalle completo del sistema de WhatsApp en [`docs/correos.md`](docs/correos.md).

---

## Tecnologías usadas

### Frontend (client & admin)
| Tecnología | Versión | Uso |
|-----------|---------|-----|
| React | 18 | Framework UI |
| TypeScript | 5 | Tipado estático |
| Vite | 5 | Build tool y dev server |
| React Router | 6 | Navegación SPA |
| Axios | 1.x | Cliente HTTP |
| recharts | 2.x | Gráficas en dashboard admin |
| react-hot-toast | 2.x | Notificaciones toast |
| CSS Modules | — | Estilos aislados por componente |

### Backend (server)
| Tecnología | Versión | Uso |
|-----------|---------|-----|
| Node.js | 20+ | Runtime |
| Express | 4 | Framework HTTP |
| MySQL 2 | 3.x | Driver MySQL con promises |
| jsonwebtoken | — | Autenticación JWT |
| bcryptjs | — | Hash de contraseñas |
| Nodemailer | — | Envío de correos |
| helmet | — | Headers de seguridad |
| cors | — | Control de orígenes |
| express-validator | — | Validación de inputs |

### Base de datos
- MySQL 9.0.1 (Homebrew) · Puerto 3307 · Socket `/tmp/mysql2.sock`

---

## Roles del sistema

| Rol | Acceso | App |
|-----|--------|-----|
| **Visitante** | Landing, servicios, formulario de contacto | `client` |
| **Usuario registrado** | Cotizar, ver historial de cotizaciones | `client` |
| **Administrador** | Panel completo: usuarios, cotizaciones, servicios, mensajes | `admin` |

---

## Instalación

### Requisitos previos
- Node.js 20+
- MySQL 9.x corriendo en puerto 3307

### 1. Clonar y preparar la base de datos

```bash
git clone <repo-url>
cd "noria-films"

# Crear base de datos
mysql -u root -p --port 3307 < database/schema.sql
mysql -u root -p --port 3307 < database/seed.sql
```

### 2. Instalar dependencias

```bash
# Servidor
cd server && npm install

# Cliente público
cd ../client && npm install

# Panel admin
cd ../admin && npm install
```

### 3. Configurar variables de entorno

```bash
cp server/.env.example server/.env
# Editar server/.env con tus valores
```

---

## Variables de entorno (`server/.env`)

```env
# Servidor
PORT=4000
NODE_ENV=development

# Base de datos
DB_HOST=localhost
DB_PORT=3307
DB_USER=root
DB_PASSWORD=tu_password
DB_NAME=noria_films

# JWT
JWT_SECRET=cambia_esto_en_produccion
JWT_EXPIRES_IN=7d

# URLs permitidas por CORS
CLIENT_URL=http://localhost:5173
ADMIN_URL=http://localhost:5174

# Email (Gmail SMTP) — solo para el correo de bienvenida al registrarse
# Dejar vacío para modo simulado (logs en consola)
MAIL_HOST=smtp.gmail.com
MAIL_PORT=587
MAIL_USER=tu@gmail.com
MAIL_PASS=xxxx_xxxx_xxxx_xxxx   # App Password de Gmail
```

> **Modo simulado**: Si `MAIL_PASS` está vacío, el servidor no crashea — imprime `[EMAIL SIMULADO]` en consola y sigue funcionando.

> **Gmail App Password**: Requiere 2FA activo en la cuenta. Generar en: `myaccount.google.com/apppasswords`

El contacto y las cotizaciones ya no usan correo: se envían por WhatsApp mediante links `wa.me` (sin API ni costo). Configurar en `client/.env` / `client/.env.production`:

```env
VITE_WHATSAPP_NUMBER=524495469811
```

Ver detalle completo en [`docs/correos.md`](docs/correos.md).

---

## Cómo crear la base de datos

```bash
# Conectar a MySQL
mysql -u root -p --port 3307

# Dentro de MySQL
source /ruta/al/proyecto/database/schema.sql;
source /ruta/al/proyecto/database/seed.sql;

# Verificar
USE noria_films;
SHOW TABLES;
SELECT email, role FROM users;
```

---

## Cómo correr el proyecto

Abrir **tres terminales**:

```bash
# Terminal 1 — Servidor API (puerto 4000)
cd server
npm run dev

# Terminal 2 — Cliente público (puerto 5173)
cd client
npm run dev

# Terminal 3 — Panel admin (puerto 5174)
cd admin
npm run dev
```

| App | URL |
|-----|-----|
| Cliente público | http://localhost:5173 |
| Panel admin | http://localhost:5174 |
| API REST | http://localhost:4000/api |
| Health check | http://localhost:4000/api/health |

---

## Credenciales seed locales

> Solo para desarrollo local. Cambiar antes de producción.

| Rol | Email | Contraseña |
|-----|-------|------------|
| Administrador | admin@noriafilms.com | Admin1234! |
| Usuario demo | usuario@test.com | Test1234! |

---

## Endpoints principales

Ver documentación completa en [`docs/endpoints.md`](docs/endpoints.md)

| Grupo | Prefijo | Auth |
|-------|---------|------|
| Autenticación | `/api/auth` | Público / JWT |
| Servicios | `/api/services` | Público (lectura) / Admin (escritura) |
| Cotizaciones | `/api/quotes` | JWT user / Admin |
| Contacto | `/api/contact` | Público (POST) / Admin (GET) |
| Admin | `/api/admin` | Admin |
| Usuarios | `/api/users` | Admin |

---

## Deploy sugerido

| Componente | Servicio | Comando |
|-----------|---------|---------|
| `client/` | Vercel o Netlify | `npm run build` → deploy `dist/` |
| `admin/` | Vercel o Netlify (proyecto separado) | `npm run build` → deploy `dist/` |
| `server/` | Railway / Render | Configurar variables de entorno en la plataforma |
| MySQL | PlanetScale / Railway DB | Ejecutar `schema.sql` + `seed.sql` |

**Antes de producción:**
1. Cambiar `JWT_SECRET` por un valor seguro aleatorio
2. Actualizar `CLIENT_URL` y `ADMIN_URL` con dominios reales
3. Configurar `MAIL_*` con credenciales reales (correo de bienvenida) y `VITE_WHATSAPP_NUMBER` (contacto/cotizaciones)
4. Eliminar usuario `usuario@test.com` del seed o cambiar su contraseña

---

## Capturas requeridas

Para la entrega académica, tomar capturas de:

1. **Landing page** — sección hero y servicios
2. **Formulario de cotización** — paso a paso con preview de precio
3. **Mis cotizaciones** — con breakdown de costos
4. **Panel admin — Dashboard** — métricas + gráfica de embudo
5. **Panel admin — Usuarios** — tabla con filtros
6. **Panel admin — Cotizaciones** — tabla expandible con cambio de estado
7. **Panel admin — Mensajes** — con búsqueda y expandido
8. **Consola servidor** — `[EMAIL SIMULADO]` o email enviado real
9. **MySQL Workbench / consola** — tablas con datos de prueba

---

## Documentación adicional

| Documento | Descripción |
|-----------|-------------|
| [`docs/endpoints.md`](docs/endpoints.md) | Tabla completa de endpoints con body y respuesta |
| [`docs/base-datos.md`](docs/base-datos.md) | Diagrama de tablas, relaciones y CRUD |
| [`docs/flujo-usuario.md`](docs/flujo-usuario.md) | Flujos de visitante, usuario y administrador |
| [`docs/evidencia-requisitos.md`](docs/evidencia-requisitos.md) | Evidencia de requisitos académicos |
| [`docs/requisitos-react.md`](docs/requisitos-react.md) | Tabla de cumplimiento de 28 requisitos React |

---

## Estructura del proyecto

```
noria-films/
├── client/          # React + TS — app pública (puerto 5173)
│   └── src/
│       ├── components/
│       ├── context/       # AuthContext (Context API)
│       ├── hooks/         # useReveal, useApi, useQuotes
│       ├── lib/           # instancia axios, helper de WhatsApp
│       ├── pages/
│       └── types/
├── admin/           # React + TS — panel admin (puerto 5174)
│   └── src/
│       ├── components/
│       ├── context/       # AuthContext admin
│       ├── lib/           # instancia axios, helper de WhatsApp
│       ├── pages/
│       └── types/
├── server/          # Node.js + Express (puerto 4000)
│   └── src/
│       ├── config/        # db, env, jwt
│       ├── controllers/
│       ├── middlewares/   # authenticateToken, authorizeRoles, validate
│       ├── routes/
│       ├── services/      # email.service (solo bienvenida)
│       └── utils/
├── database/
│   ├── schema.sql            # Definición de tablas
│   ├── seed.sql               # Datos iniciales
│   └── migration_v2.sql...v8.sql  # Cambios incrementales (ver database/README.md)
└── docs/            # Documentación académica
```
