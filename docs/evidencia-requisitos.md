# Evidencia de Requisitos — NORIA Creative Film Studio

---

## Frontend React

| Requisito | Evidencia | Archivo |
|-----------|-----------|---------|
| React 18 | `ReactDOM.createRoot()` con JSX | `client/src/main.tsx`, `admin/src/main.tsx` |
| Componentes funcionales | 100% funciones, cero clases | Todos los `.tsx` |
| TypeScript estricto | `tsconfig.json` con `"strict": true` | `client/tsconfig.json`, `admin/tsconfig.json` |
| Props tipadas | Interfaces `{ children: ReactNode }`, `{ label, value, accent }` | `AdminLayout.tsx`, `Dashboard.tsx:68` |
| useState | Control de formularios, loading, UI state | `Login.tsx`, `Quote.tsx`, `Services.tsx`… |
| useEffect montaje | Carga de datos al montar | `Dashboard.tsx:13` |
| useEffect actualización | Re-fetch al cambiar filtro/tab | `Quotes.tsx:52`, `Messages.tsx:43` |
| useEffect limpieza | Elimina listeners de eventos | `Header.tsx:25–39` (`removeEventListener`) |
| Custom hooks | `useReveal` (IntersectionObserver), `useApi`, `useQuotes` | `client/src/hooks/` |
| Context API | `AuthContext` con `createContext` + `Provider` + `useContext` | `client/src/context/AuthContext.tsx` |
| Eventos tipados | `FormEvent`, `ChangeEvent<HTMLInputElement>` | `Contact.tsx`, `Users.tsx` |
| Funciones anidadas | Handlers definidos dentro del componente | `Services.tsx:41`, `Header.tsx:42` |
| Promesas | `Promise.all([...])` para carga paralela | `Schedule.tsx` |
| async / await | Todas las llamadas API | `Quote.tsx`, `Appointments.tsx`… |
| axios | Instancia con interceptor de auth | `client/src/lib/api.ts` |
| loading/success/error | Estados de UI en cada operación async | `Contact.tsx:16`, `Dashboard.tsx:9–10` |
| Formulario controlado | `value={form.field}` + `onChange` | `Login.tsx`, `Register.tsx`, `Contact.tsx` |
| Formulario no controlado | `useRef` + `defaultValue`, leído en submit | `Messages.tsx:30–31` |
| Renderizado condicional | Ternarios y `&&` | `Header.tsx:72`, `Services.tsx:121` |
| Renderizado de listas | `.map()` con `key` | `Quotes.tsx:101`, `Services.tsx:106` |
| React Router | `BrowserRouter`, `Routes`, `Route` | `client/App.tsx`, `admin/App.tsx` |
| Rutas con parámetros | `:id`, `:quoteId` + `useParams()` | `admin/App.tsx`, `UserDetail.tsx`, `Schedule.tsx` |
| Query params | `useSearchParams()` para `?redirect=` | `Login.tsx:14` |
| Rutas anidadas | Layout route con `<Outlet />` en admin | `admin/App.tsx:40–52` |
| NavLink | Active class en sidebar admin y dropdown cliente | `Sidebar.tsx:34`, `Header.tsx:79` |
| children prop | Componentes de layout que envuelven | `AdminLayout.tsx`, `PublicLayout.tsx` |
| Rutas protegidas | Redirect a `/login` si sin auth o rol insuficiente | `ProtectedRoute.tsx`, `ProtectedAdminRoute.tsx` |
| Error 404 | `path="*"` → `<NotFound />` | `client/App.tsx:39` |
| Lazy loading | `React.lazy()` + `<Suspense>` | `client/App.tsx:7–13`, `admin/App.tsx:7–15` |
| **recharts** (extra) | `BarChart` embudo de conversión en dashboard | `admin/pages/Dashboard/Dashboard.tsx` |
| **react-hot-toast** (extra) | Toast success/error al guardar servicios | `admin/pages/Services/Services.tsx` |

---

## Backend Node.js / Express

| Requisito | Evidencia | Archivo |
|-----------|-----------|---------|
| Node.js + Express | Framework REST API | `server/src/app.js` |
| Separación de capas | routes → controllers → services | `src/routes/`, `src/controllers/`, `src/services/` |
| Middlewares | auth, authorizeRoles, validate, helmet, cors, morgan | `src/middlewares/`, `src/app.js` |
| Express Validator | Validación de body en cada ruta | Todos los `.routes.js` |
| Variables de entorno | `dotenv` + validación al arranque | `src/config/env.js` |
| Error handling global | Middleware de error + R.serverError() | `src/app.js:55–59`, `src/utils/response.js` |
| CORS configurado | Whitelist `CLIENT_URL` + `ADMIN_URL` | `src/app.js:14–20` |
| Helmet | Headers de seguridad HTTP | `src/app.js:11` |
| Nodemailer | Email con modo simulado si sin SMTP | `src/services/email.service.js` |
| node-cron | Recordatorios automáticos cada 10 min | `src/services/reminder.cron.js` |
| bcryptjs | Hash de contraseñas, nunca texto plano | `src/controllers/auth.controller.js` |
| jsonwebtoken | JWT para autenticación stateless | `src/config/jwt.js`, `src/middlewares/authenticateToken.js` |
| DB Transactions | `BEGIN TRANSACTION` + `FOR UPDATE` anti race-condition | `src/controllers/appointments.controller.js` |

---

## APIs REST

| Requisito | Evidencia |
|-----------|-----------|
| CRUD completo | Create/Read/Update en todas las entidades principales |
| Verbos HTTP correctos | GET (leer), POST (crear), PUT (reemplazar), PATCH (actualizar parcial), DELETE (eliminar) |
| Códigos de estado | 200, 201, 400, 401, 403, 404, 409, 500 |
| Query params | `?status=`, `?search=`, `?hasQuote=`, `?hasAppointment=` |
| Rutas con parámetros | `/users/:id`, `/quotes/:id`, `/appointments/:id/status` |
| Endpoint de salud | `GET /api/health` |
| Pricing público | `GET /api/quotes/pricing-config` |

---

## Autenticación y Autorización

| Requisito | Implementación |
|-----------|---------------|
| JWT Bearer | Token en `Authorization: Bearer <jwt>` header |
| Middleware `authenticateToken` | Verifica firma y expiración del token |
| Middleware `authorizeRoles` | Compara `req.user.role` con roles requeridos |
| Roles | `user` (cliente) y `admin` (panel) |
| Admin separado | App React independiente en puerto 5174 |
| Passwords hasheadas | `bcrypt.hash(password, 10)` — salt rounds 10 |
| Token expiration | `7d` configurable en `.env` (`JWT_EXPIRES_IN`) |

---

## MySQL

| Requisito | Implementación |
|-----------|---------------|
| Base de datos relacional | MySQL 9.0.1 |
| 8 tablas | users, services, quotes, availability_slots, blocked_dates, appointments, appointment_reminders, contact_messages |
| Foreign Keys | 7 constraints FK con ON DELETE implícito |
| UNIQUE constraints | `email`, `(date, start_time)`, `slot_id` en appointments |
| ENUMs | role, status, meeting_type, reminder_type, etc. |
| Pool de conexiones | `mysql2/promise` con `waitForConnections: true` |
| Timezone | `timezone: '+00:00'` consistente |
| Schema + Seed | `database/schema.sql`, `database/seed.sql` |
| Migración | `database/migration_v2.sql` para cambios incrementales |

---

## Deploy sugerido

| Componente | Servicio sugerido | Notas |
|-----------|-------------------|-------|
| **client** (React) | Vercel / Netlify | `npm run build` → carpeta `dist/` |
| **admin** (React) | Vercel / Netlify (proyecto separado) | `npm run build` → carpeta `dist/` |
| **server** (Node.js) | Railway / Render / DigitalOcean App Platform | Puerto configurable por `PORT` en `.env` |
| **MySQL** | PlanetScale / Railway MySQL / DigitalOcean Managed DB | Cambiar `DB_HOST`, `DB_PORT`, `DB_USER`, `DB_PASSWORD` |
| **Email** | Gmail App Password o SendGrid | Configurar `MAIL_*` en `.env` de producción |

**Pasos de deploy:**
1. Crear BD en servicio cloud y ejecutar `schema.sql` + `seed.sql`
2. Configurar variables de entorno en servidor (sin `.env` en repo)
3. Actualizar `CLIENT_URL` y `ADMIN_URL` en `.env` del servidor con dominios reales
4. Build de client y admin → desplegar en Vercel/Netlify
5. Deploy del server → apuntar `VITE_API_URL` en client/admin a la URL del server en producción
