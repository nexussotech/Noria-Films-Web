# Requisitos React — NORIA Creative Film Studio

> Proyecto escolar · React 18 + TypeScript + Vite · Junio 2026

| # | Requisito | Archivo donde se cumple | Explicación breve |
|---|-----------|-------------------------|-------------------|
| 1 | **React como frontend** | `client/src/main.tsx`, `admin/src/main.tsx` | Ambas apps arrancan con `ReactDOM.createRoot` y JSX |
| 2 | **Componentes funcionales** | Todos los archivos `.tsx` | 100 % de componentes son funciones; ninguno es clase |
| 3 | **Props tipadas con TypeScript** | `client/src/components/layout/PublicLayout.tsx:5`<br>`admin/src/components/layout/AdminLayout.tsx:5`<br>`admin/src/pages/Dashboard/Dashboard.tsx:68` | `{ children: ReactNode }`, `{ label, value, accent, onClick? }` — interfaces explícitas en cada componente que recibe props |
| 4 | **useState** | Todos los pages (`Login`, `Quote`, `MyQuotes`, `Services`, etc.) | Control de formularios, carga, errores, estado de UI |
| 5 | **useEffect — montaje** | `admin/src/pages/Dashboard/Dashboard.tsx:13` | Carga de stats al montar: `useEffect(() => { api.get(...) }, [])` |
| 6 | **useEffect — actualización** | `client/src/components/layout/Header/Header.tsx:31`<br>`admin/src/pages/Quotes/Quotes.tsx:52` | Se dispara cuando cambia `location` o `filter` (dependencia en array) |
| 7 | **useEffect — limpieza (cleanup)** | `client/src/components/layout/Header/Header.tsx:25–28`<br>`client/src/components/layout/Header/Header.tsx:34–39` | `return () => window.removeEventListener(...)` y `return () => document.removeEventListener(...)` |
| 8 | **Hooks personalizados** | `client/src/hooks/useReveal.ts` (IntersectionObserver para animaciones)<br>`client/src/hooks/useApi.ts` (wrapper genérico de axios)<br>`client/src/hooks/useQuotes.ts` (estado de cotizaciones del usuario) | Funciones `use*` reutilizables que encapsulan lógica con hooks internos |
| 9 | **Estado global — Context API** | `client/src/context/AuthContext.tsx`<br>`admin/src/context/AuthContext.tsx` | `createContext` + `useContext` + `Provider`; expone `user`, `login`, `logout` a toda la app |
| 10 | **Eventos** | `client/src/pages/Home/sections/Contact/Contact.tsx` (`onSubmit`)<br>`admin/src/pages/Users/Users.tsx` (`onClick`, `onChange`) | Handlers tipados: `FormEvent`, `ChangeEvent<HTMLInputElement>` |
| 11 | **Funciones anidadas** | `admin/src/pages/Services/Services.tsx:41` (`startEdit`)<br>`client/src/pages/Quote/Quote.tsx` | Funciones definidas dentro del componente que cierran sobre estado local |
| 12 | **Promesas** | `client/src/pages/Quote/Quote.tsx` | `Promise.all([api.get(...), api.get(...)])` para carga paralela de servicios + pricing-config |
| 13 | **async / await** | `client/src/pages/Quote/Quote.tsx`<br>`admin/src/pages/Quotes/Quotes.tsx` | Todas las llamadas a API usan `async/await` dentro de funciones nombradas |
| 14 | **Consumo de API con axios** | `client/src/lib/api.ts` (instancia axios)<br>Todos los pages con `api.get / api.post / api.put / api.patch` | Interceptor de request añade `Authorization: Bearer <token>` automáticamente |
| 15 | **Estado loading / success / error** | `client/src/pages/Home/sections/Contact/Contact.tsx:16`<br>`admin/src/pages/Dashboard/Dashboard.tsx:9–10` | `useState<'idle'\|'loading'\|'success'\|'error'>` con renderizado condicional de cada estado |
| 16 | **Formularios controlados** | `client/src/pages/Login/Login.tsx`<br>`client/src/pages/Register/Register.tsx`<br>`client/src/pages/Home/sections/Contact/Contact.tsx` | Cada `<input>` tiene `value={form.field}` + `onChange` que actualiza estado |
| 17 | **Formulario no controlado — useRef** | `admin/src/pages/Messages/Messages.tsx:30–31` | `const searchRef = useRef<HTMLInputElement>(null)`; el `<input>` usa `defaultValue` y el valor se lee solo en el `onSubmit` mediante `searchRef.current?.value` |
| 18 | **Renderizado condicional** | `client/src/components/layout/Header/Header.tsx:72` (`user ? ... : ...`)<br>`admin/src/pages/Services/Services.tsx:121` (`editing !== s.id ? ... : ...`) | Ternarios y `&&` para mostrar/ocultar secciones según estado |
| 19 | **Renderizado de listas** | `admin/src/pages/Quotes/Quotes.tsx:101` (`.map()` de tabla)<br>`admin/src/pages/Services/Services.tsx:106` (grid de cards) | `.map()` con `key` único en cada elemento |
| 20 | **React Router** | `client/src/App.tsx`<br>`admin/src/App.tsx` | `BrowserRouter`, `Routes`, `Route`, `Navigate` en ambas apps |
| 21 | **Rutas con parámetros** | `admin/src/App.tsx`: `path="usuarios/:id"` | Parámetro leído con `useParams()` en `UserDetail.tsx` |
| 22 | **Query params** | `client/src/pages/Login/Login.tsx:2,14` | `useSearchParams()` para leer `?redirect=` y redirigir tras login |
| 23 | **Rutas anidadas** | `admin/src/App.tsx:40–52` | `<Route path="/" element={<AdminShell />}>` contiene 9 rutas hijas; `AdminShell` renderiza `<Outlet />` donde se inyecta cada página hija |
| 24 | **NavLink** | `admin/src/components/layout/Sidebar.tsx:34` (sidebar admin)<br>`client/src/components/layout/Header/Header.tsx:79` (dropdown usuario) | `className={({ isActive }) => ...}` aplica estilos dinámicos al enlace activo |
| 25 | **Uso de children** | `admin/src/components/layout/AdminLayout.tsx:5` (`children: ReactNode`)<br>`client/src/components/layout/PublicLayout.tsx:5` | Componentes de layout que envuelven contenido con `{children}` |
| 26 | **Rutas protegidas** | `client/src/components/auth/ProtectedRoute.tsx`<br>`admin/src/components/auth/ProtectedAdminRoute.tsx` | Redirige a `/login` si no hay sesión; admin además verifica `role === 'admin'` |
| 27 | **Error 404** | `client/src/App.tsx:39`: `<Route path="*" element={<NotFound />} />` | Ruta catch-all que muestra página 404 personalizada |
| 28 | **Lazy loading** | `client/src/App.tsx:7–13`<br>`admin/src/App.tsx:7–15` | `React.lazy(() => import(...))` + `<Suspense fallback={<Fallback />}>` en ambas apps |

---

## Aportaciones extra de librerías React

| Librería | Ubicación | Qué aporta |
|----------|-----------|------------|
| **recharts** | `admin/src/pages/Dashboard/Dashboard.tsx` | `<BarChart>` con `<ResponsiveContainer>` muestra el embudo de conversión (usuarios registrados → con cotización → pendientes → mensajes) con colores por categoría y tooltip personalizado |
| **react-hot-toast** | `admin/src/App.tsx` (`<Toaster>`)<br>`admin/src/pages/Services/Services.tsx` (`toast.success / toast.error`) | Notificaciones no bloqueantes con estilo NORIA (fondo oscuro, borde sutil) que reemplazan mensajes de éxito/error inline en la gestión de servicios |

---

## Resumen de cobertura

- **28 / 28** requisitos de la rúbrica cubiertos
- **2** librerías extra integradas (recharts, react-hot-toast)
- Evidencia distribuida entre `client/` y `admin/` para mayor amplitud de demostración
