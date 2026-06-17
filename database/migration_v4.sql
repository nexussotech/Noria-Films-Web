-- ============================================================
--  NORIA Creative Film Studio — Migration v4
-- ============================================================

USE noria_films;

-- 1. Agregar quote_code a quotes (safe: ignorar si ya existe)
SET @sql = IF(
  EXISTS(
    SELECT 1 FROM information_schema.COLUMNS
    WHERE TABLE_SCHEMA='noria_films' AND TABLE_NAME='quotes' AND COLUMN_NAME='quote_code'
  ),
  'SELECT "quote_code already exists" AS info',
  'ALTER TABLE quotes ADD COLUMN quote_code VARCHAR(20) DEFAULT NULL AFTER id'
);
PREPARE stmt FROM @sql; EXECUTE stmt; DEALLOCATE PREPARE stmt;

-- 2. Modificar ENUM status de contact_messages para incluir answered
ALTER TABLE contact_messages
  MODIFY COLUMN status ENUM('new','read','archived','answered') NOT NULL DEFAULT 'new';
