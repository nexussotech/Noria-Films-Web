# Manual de Pruebas — NORIA Creative Film Studio

> Pruebas funcionales realizadas sobre el sistema completo (client + admin + API).
> Estado: PASS = funciona correctamente · FAIL = error encontrado

---

## Módulo 1 — Autenticación

| ID | Módulo | Caso de prueba | Pasos | Resultado esperado | Estado |
|----|--------|----------------|-------|-------------------|--------|
| T01 | Login cliente | Credenciales correctas | 1. Ir a /login · 2. Ingresar usuario@test.com / Test1234! · 3. Submit | Redirige a / con sesión activa | PASS |
| T02 | Login cliente | Credenciales incorrectas | 1. Ir a /login · 2. Ingresar email o contraseña incorrectos · 3. Submit | Muestra mensaje de error inline | PASS |
| T03 | Login admin | Credenciales admin correctas | 1. Ir a :5174/login · 2. Ingresar admin@noriafilms.com / Admin1234! · 3. Submit | Redirige a /dashboard | PASS |
| T04 | Login admin | Usuario sin rol admin intenta entrar | 1. Ir a :5174/login · 2. Ingresar credenciales de usuario regular · 3. Submit | Mensaje "Acceso restringido" o redirección | PASS |
| T05 | Registro | Registro con email nuevo | 1. Ir a /registro · 2. Llenar todos los campos · 3. Submit | Cuenta creada, token automático, redirige a / | PASS |
| T06 | Registro | Registro con email duplicado | 1. Ir a /registro · 2. Usar email ya registrado · 3. Submit | Error 409, mensaje inline | PASS |
| T07 | Ruta protegida | Acceder a /cotizacion sin sesión | 1. Sin estar autenticado · 2. Navegar a /cotizacion | Redirige a /login?redirect=/cotizacion | PASS |
| T08 | Cierre de sesión | Logout cliente | 1. Autenticado · 2. Hacer clic en "Cerrar sesión" | Token eliminado, redirige a / | PASS |

---

## Módulo 2 — Cotizaciones (cliente)

| ID | Módulo | Caso de prueba | Pasos | Resultado esperado | Estado |
|----|--------|----------------|-------|-------------------|--------|
| T09 | Cotización paso 1 | Selección de servicio | 1. Ir a /cotizacion · 2. Seleccionar cualquier servicio | Servicio resaltado, botón "Siguiente" activo | PASS |
| T10 | Cotización paso 2 | Selección de opciones completas | 1. Seleccionar duración · 2. Seleccionar dron · 3. Seleccionar entrega | Preview de precio actualizado en tiempo real | PASS |
| T11 | Cotización paso 3 | Visualizar desglose | 1. Completar pasos 1 y 2 · 2. Avanzar a paso 3 | Desglose con base, rodaje, equipo, entrega y total | PASS |
| T12 | Cotización | Confirmar cotización | 1. Completar pasos · 2. Clic "Confirmar cotización" | Cotización creada, pantalla de éxito, email enviado | PASS |
| T13 | Cotización | Precio calculado por backend | 1. Inspeccionar payload enviado | El total no se envía desde el frontend; el backend calcula | PASS |
| T14 | Mis cotizaciones | Ver historial | 1. Ir a /mis-cotizaciones | Lista de cotizaciones con estado, servicio y precio | PASS |
| T15 | Mis cotizaciones | Estado "scheduled" oculta botón agendar | 1. Cotización con estado scheduled · 2. Ver tarjeta | No muestra botón "Agendar" | PASS |

---

## Módulo 3 — Citas (cliente)

| ID | Módulo | Caso de prueba | Pasos | Resultado esperado | Estado |
|----|--------|----------------|-------|-------------------|--------|
| T16 | Agendar cita | Cargar slots disponibles | 1. Ir a /agendar/:quoteId | Se muestran slots futuros agrupados por fecha | PASS |
| T17 | Agendar cita | Slots del día actual ya pasados | 1. Verificar que horarios del día con hora anterior a la actual no aparezcan | No se muestran horarios expirados | PASS |
| T18 | Agendar cita | Selección de slot y modalidad | 1. Seleccionar horario · 2. Seleccionar Virtual o Presencial | Slot resaltado, modalidad seleccionada, botón activo | PASS |
| T19 | Agendar cita | Confirmar cita | 1. Slot y modalidad seleccionados · 2. Clic "Confirmar cita" | Cita creada, pantalla de confirmación, emails enviados | PASS |
| T20 | Agendar cita | Slot ya ocupado (race condition) | 1. Dos sesiones intentan reservar el mismo slot | Segunda reserva recibe error 409 "El horario ya fue reservado" | PASS |
| T21 | Agendar cita | Cotización ya agendada | 1. Intentar agendar cotización con status=scheduled | Muestra pantalla "Esta cotización ya tiene cita agendada" | PASS |

---

## Módulo 4 — Panel Admin — Cotizaciones

| ID | Módulo | Caso de prueba | Pasos | Resultado esperado | Estado |
|----|--------|----------------|-------|-------------------|--------|
| T22 | Admin cotizaciones | Ver listado | 1. Ir a /cotizaciones · 2. Ver tabla | Lista todas las cotizaciones con usuario, servicio y estado | PASS |
| T23 | Admin cotizaciones | Filtrar por estado | 1. Seleccionar filtro "generated" | Solo se muestran cotizaciones en ese estado | PASS |
| T24 | Admin cotizaciones | Expandir fila | 1. Clic en fila de cotización | Muestra desglose de costos | PASS |
| T25 | Admin cotizaciones | Cambiar estado | 1. Expandir fila · 2. Cambiar estado a "cancelled" | Estado actualizado en DB, UI refleja el cambio | PASS |

---

## Módulo 5 — Panel Admin — Citas

| ID | Módulo | Caso de prueba | Pasos | Resultado esperado | Estado |
|----|--------|----------------|-------|-------------------|--------|
| T26 | Admin citas | Ver listado | 1. Ir a /citas | Lista citas con usuario, fecha y estado | PASS |
| T27 | Admin citas | Confirmar cita | 1. Seleccionar cita pending · 2. Cambiar a "confirmed" | Estado actualizado, slot permanece reservado | PASS |
| T28 | Admin citas | Cancelar cita | 1. Seleccionar cita · 2. Cambiar a "cancelled" | Slot liberado, cotización vuelve a "generated", recordatorios cancelados | PASS |

---

## Módulo 6 — Panel Admin — Disponibilidad

| ID | Módulo | Caso de prueba | Pasos | Resultado esperado | Estado |
|----|--------|----------------|-------|-------------------|--------|
| T29 | Disponibilidad | Crear slot | 1. Ir a /disponibilidad · 2. Seleccionar fecha y hora · 3. Crear | Slot aparece en la lista | PASS |
| T30 | Disponibilidad | Eliminar slot | 1. Seleccionar slot existente · 2. Eliminar | Slot removido de la lista | PASS |
| T31 | Disponibilidad | Bloquear fecha | 1. Seleccionar fecha · 2. Ingresar motivo · 3. Bloquear | Fecha bloqueada, no aparece en slots del cliente | PASS |
| T32 | Disponibilidad | Desbloquear fecha | 1. Seleccionar fecha bloqueada · 2. Desbloquear | Fecha disponible nuevamente | PASS |

---

## Módulo 7 — Panel Admin — Usuarios

| ID | Módulo | Caso de prueba | Pasos | Resultado esperado | Estado |
|----|--------|----------------|-------|-------------------|--------|
| T33 | Usuarios | Buscar por nombre/email | 1. Ir a /usuarios · 2. Escribir en campo de búsqueda | Se filtran usuarios en tiempo real | PASS |
| T34 | Usuarios | Filtrar con/sin cotización | 1. Seleccionar filtro "Con cotización" | Solo muestra usuarios que tienen al menos una cotización | PASS |
| T35 | Usuarios | Ver detalle de usuario | 1. Clic en usuario · 2. Ir a /usuarios/:id | Muestra historial de cotizaciones y citas del usuario | PASS |
| T36 | Usuarios | Activar/desactivar usuario | 1. En detalle de usuario · 2. Clic "Desactivar" | Status del usuario cambia en DB | PASS |

---

## Módulo 8 — Panel Admin — Servicios

| ID | Módulo | Caso de prueba | Pasos | Resultado esperado | Estado |
|----|--------|----------------|-------|-------------------|--------|
| T37 | Servicios | Ver grid de servicios | 1. Ir a /servicios | Muestra 8 servicios con nombre, precio e ícono | PASS |
| T38 | Servicios | Editar nombre y precio | 1. Clic "Editar" · 2. Modificar campos · 3. Guardar | Toast de éxito, datos actualizados en UI | PASS |
| T39 | Servicios | Desactivar servicio | 1. Clic "Desactivar" en servicio activo | Servicio marcado como inactivo, no aparece en cotizador | PASS |

---

## Módulo 9 — Mensajes de Contacto

| ID | Módulo | Caso de prueba | Pasos | Resultado esperado | Estado |
|----|--------|----------------|-------|-------------------|--------|
| T40 | Contacto | Enviar mensaje como visitante | 1. Ir a / (sección contacto) · 2. Llenar formulario · 3. Enviar | Mensaje guardado en DB, email de confirmación al usuario y notificación al admin | PASS |
| T41 | Admin mensajes | Ver mensajes | 1. Ir a /mensajes | Lista de mensajes con estado y fecha | PASS |
| T42 | Admin mensajes | Buscar (formulario no controlado) | 1. Escribir en campo de búsqueda · 2. Submit | Filtra por nombre, email o asunto usando useRef | PASS |
| T43 | Admin mensajes | Marcar como leído | 1. Expandir mensaje · 2. Marcar leído | Estado cambia a "read" | PASS |
| T44 | Admin mensajes | Archivar mensaje | 1. Clic "Archivar" | Estado cambia a "archived" | PASS |

---

## Módulo 10 — Correos electrónicos

| ID | Módulo | Caso de prueba | Pasos | Resultado esperado | Estado |
|----|--------|----------------|-------|-------------------|--------|
| T45 | Email | Bienvenida al registrar | 1. Crear cuenta nueva | Email de bienvenida al usuario | PASS |
| T46 | Email | Confirmación de cotización | 1. Crear cotización | Email con desglose al usuario + notificación al admin | PASS |
| T47 | Email | Confirmación de cita | 1. Agendar cita | Email con detalles completos al usuario + notificación al admin | PASS |
| T48 | Email | Recordatorio 24h | 1. Esperar a que el cron procese | Email de recordatorio 24h antes de la cita | PASS |
| T49 | Email | Ack de contacto | 1. Enviar formulario de contacto | Email de confirmación al remitente | PASS |
| T50 | Email | Modo simulado sin SMTP | 1. Quitar MAIL_PASS del .env · 2. Reiniciar server | Imprime [EMAIL SIMULADO] en consola sin crashear | PASS |
