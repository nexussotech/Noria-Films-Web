-- ============================================================
--  NORIA Films — Migración v5
--  Elimina el sistema de agendamiento de citas
-- ============================================================
USE noria_films;

-- 1. Eliminar tablas dependientes primero (FKs), luego las base
DROP TABLE IF EXISTS appointment_reminders;
DROP TABLE IF EXISTS appointments;
DROP TABLE IF EXISTS availability_slots;
DROP TABLE IF EXISTS blocked_dates;

-- 2. Quitar 'scheduled' del ENUM status de quotes
--    (revertir cualquier cotización 'scheduled' a 'generated' antes de alterar el ENUM)
UPDATE quotes SET status='generated' WHERE status='scheduled';
ALTER TABLE quotes
  MODIFY COLUMN status ENUM('draft','generated','cancelled') NOT NULL DEFAULT 'draft';
