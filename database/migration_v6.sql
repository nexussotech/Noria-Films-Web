-- ============================================================
--  NORIA Films — Migración v6
--  Agrega 'answered' al ENUM de status de contact_messages
--  (usado por el botón "Seguimiento por WhatsApp" del panel admin)
-- ============================================================
USE noria_films;

ALTER TABLE contact_messages
  MODIFY COLUMN status ENUM('new','read','archived','answered') NOT NULL DEFAULT 'new';
