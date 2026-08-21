-- ============================================================
--  NORIA Films — Migración v8
--  Teléfono único por cuenta de usuario
--  (si existen duplicados, resolverlos antes de correr esta
--  migración o el ALTER fallará)
-- ============================================================
USE noria_films;

ALTER TABLE users
  ADD CONSTRAINT uq_users_phone UNIQUE (phone);
