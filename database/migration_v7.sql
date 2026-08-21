-- ============================================================
--  NORIA Films — Migración v7
--  Elimina columnas huérfanas de quotes que no forman parte del
--  schema.sql actual ni son usadas por ningún controller
--  (quote_code, duration, locations, deliverables)
-- ============================================================
USE noria_films;

ALTER TABLE quotes
  DROP COLUMN quote_code,
  DROP COLUMN duration,
  DROP COLUMN locations,
  DROP COLUMN deliverables;
