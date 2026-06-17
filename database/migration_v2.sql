-- ============================================================
--  NORIA Films — Migración v2
-- ============================================================
USE noria_films;

-- 1. Limpiar datos de prueba (test data)
DELETE FROM quotes;

-- 2. Nuevas columnas en quotes
ALTER TABLE quotes
  ADD COLUMN shooting_duration   VARCHAR(20)   DEFAULT NULL    AFTER service_id,
  ADD COLUMN needs_drone         TINYINT(1)    NOT NULL DEFAULT 0 AFTER shooting_duration,
  ADD COLUMN delivery_time       VARCHAR(20)   DEFAULT NULL    AFTER needs_drone,
  ADD COLUMN production_cost     DECIMAL(10,2) NOT NULL DEFAULT 0 AFTER extra_notes,
  ADD COLUMN equipment_cost      DECIMAL(10,2) NOT NULL DEFAULT 0 AFTER production_cost,
  ADD COLUMN postproduction_cost DECIMAL(10,2) NOT NULL DEFAULT 0 AFTER equipment_cost,
  ADD COLUMN extras_cost         DECIMAL(10,2) NOT NULL DEFAULT 0 AFTER postproduction_cost;

-- 3. Actualizar servicios con catálogo real del cliente
UPDATE services SET name='Reel para redes',     description='Producción de reels profesionales para redes sociales: Instagram, TikTok, YouTube Shorts.', base_price=1500.00,  icon='📱', image_url='https://images.unsplash.com/photo-1611162617213-7d7a39e9b1d7?w=600&q=80' WHERE id=1;
UPDATE services SET name='Sesión fotográfica',  description='Sesión de fotografía profesional para retrato, producto, evento o contenido editorial.', base_price=1000.00,  icon='📸', image_url='https://images.unsplash.com/photo-1554048612-b6a482bc67e5?w=600&q=80' WHERE id=2;
UPDATE services SET name='Videoclip',           description='Producción integral de videoclips artísticos con concepto visual, dirección de arte y postproducción.', base_price=8000.00,  icon='🎵', image_url='https://images.unsplash.com/photo-1637250096679-c10f2751def8?w=600&q=80' WHERE id=3;
UPDATE services SET name='Videodanza',          description='Registro y producción audiovisual de piezas de danza contemporánea, ballet y artes escénicas.', base_price=8000.00,  icon='💃', image_url='https://images.unsplash.com/photo-1508700115892-45ecd05ae2ad?w=600&q=80' WHERE id=4;
UPDATE services SET name='Comercial',           description='Producción de spots publicitarios para televisión, medios digitales y campañas de marca.', base_price=12000.00, icon='📺', image_url='https://images.unsplash.com/photo-1611784728558-6c7d9b409cdf?w=600&q=80' WHERE id=5;
UPDATE services SET name='Cobertura de evento', description='Registro profesional de eventos: conciertos, conferencias, bodas corporativas y ceremonias.', base_price=5000.00,  icon='🎤', image_url='https://images.unsplash.com/photo-1603126004372-e63e3b53934b?w=600&q=80' WHERE id=6;
UPDATE services SET name='Video institucional', description='Video corporativo que comunica identidad, valores y propuesta de valor de tu organización.', base_price=9000.00,  icon='🏢', image_url='https://images.unsplash.com/photo-1560179707-f14e90ef3623?w=600&q=80' WHERE id=7;

-- 4. Insertar servicio 8 — Cortometraje
INSERT INTO services (name, description, base_price, icon, image_url, active) VALUES
('Cortometraje', 'Desarrollo completo de proyectos cinematográficos de corta duración: guión, casting, rodaje y postproducción.', 25000.00, '🎞', 'https://images.unsplash.com/photo-1625690303837-654c9666d2d0?w=600&q=80', 1);

-- Verificación
SELECT id, name, base_price FROM services ORDER BY id;
