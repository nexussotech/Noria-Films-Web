-- ============================================================
--  NORIA Creative Film Studio — Migration v3
--  Reemplaza íconos emoji de servicios por códigos de texto
--  Ejecutar sobre base de datos existente (noria_films)
-- ============================================================
USE noria_films;

UPDATE services SET icon = 'RS' WHERE name = 'Reel para redes';
UPDATE services SET icon = 'SF' WHERE name = 'Sesión fotográfica';
UPDATE services SET icon = 'VC' WHERE name = 'Videoclip';
UPDATE services SET icon = 'VD' WHERE name = 'Videodanza';
UPDATE services SET icon = 'CM' WHERE name = 'Comercial';
UPDATE services SET icon = 'EV' WHERE name = 'Cobertura de evento';
UPDATE services SET icon = 'VI' WHERE name = 'Video institucional';
UPDATE services SET icon = 'CT' WHERE name = 'Cortometraje';
