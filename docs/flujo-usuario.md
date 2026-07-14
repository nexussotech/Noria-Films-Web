# Flujos de Usuario — NORIA Creative Film Studio

---

## 1. Visitante (sin cuenta)

```
Landing Page (/)
    │
    ├── Ve secciones: Inicio → Nosotros → Servicios → Portafolio → Talento → Contacto
    │
    ├── Servicios → catálogo público con precios base
    │
    ├── Formulario de contacto → POST /api/contact
    │       └── Recibe email de confirmación (o simulado en dev)
    │
    └── Botón "Mi Cuenta" → /login
            └── Si intenta ir a /cotizacion o /mis-cotizaciones → redirige a /login
```

---

## 2. Registro e inicio de sesión

```
/login
    │
    ├── Formulario login → POST /api/auth/login
    │       ├── OK → guarda token en localStorage (noria_token) → redirige a destino o /
    │       └── Error → mensaje inline
    │
    └── Link "Registrarse" → /registro
            └── Formulario → POST /api/auth/register
                    ├── OK → token automático → redirige a /
                    └── Error (email duplicado, etc.) → mensaje inline
```

---

## 3. Usuario registrado

```
Usuario autenticado (header muestra nombre + menú)
    │
    ├── Nueva Cotización → /cotizacion
    │
    ├── Mis Cotizaciones → /mis-cotizaciones
    │
    └── Cerrar Sesión → limpia token → redirige a /
```

---

## 4. Flujo de Cotización

```
/cotizacion
    │
    ├── Paso 1: Seleccionar servicio (GET /api/services)
    │
    ├── Paso 2: Duración del rodaje (1 día / 2 días / 3+ días)
    │
    ├── Paso 3: ¿Necesita dron? (Sí / No) + tipo de proyecto + notas
    │
    ├── Paso 4: Tiempo de entrega (3 sem / 1 sem / 2-4 días)
    │
    ├── Preview de precio en tiempo real (fórmula aditiva):
    │       Total = Base + Producción + Equipo + Postproducción + Extras
    │
    └── Confirmar → POST /api/quotes
            ├── OK (201) → cotización guardada con status='generated'
            │       ├── Usuario recibe email de confirmación
            │       └── Admin recibe notificación por email
            └── Error → mensaje de error inline
```

---

## 5. Flujo del Administrador

```
http://localhost:5174  (app independiente)
    │
    └── /login (admin)
            └── POST /api/auth/login → verifica role='admin'
                    └── Dashboard /dashboard
                            │
                            ├── Métricas globales (GET /api/admin/dashboard/stats)
                            │       └── Gráfica de embudo: usuarios → cotizaciones
                            │
                            ├── Usuarios (/usuarios)
                            │       ├── Buscar por nombre/email (controlled + tabla)
                            │       ├── Filtrar: todos / con cotización
                            │       └── Detalle (/usuarios/:id):
                            │               ├── Activar/desactivar usuario
                            │               └── Historial de cotizaciones
                            │
                            ├── Servicios (/servicios)
                            │       ├── Ver grid de servicios
                            │       ├── Editar nombre, descripción, precio, icono
                            │       └── Activar / Desactivar servicio
                            │
                            ├── Cotizaciones (/cotizaciones)
                            │       ├── Filtrar por status
                            │       ├── Expandir fila para ver detalles
                            │       └── Cambiar status directamente
                            │
                            └── Mensajes (/mensajes)
                                    ├── Filtrar por status (nuevos/leídos/archivados)
                                    ├── Buscar por nombre/email/asunto (formulario no controlado)
                                    ├── Expandir mensaje completo
                                    ├── Marcar leído / Archivar / Restaurar
                                    └── Botón "Responder por email" (mailto:)
```
