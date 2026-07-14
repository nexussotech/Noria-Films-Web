-- ============================================================
--  NORIA Creative Film Studio — Seed v3
--  Ejecutar DESPUÉS de schema.sql
-- ============================================================
USE noria_films;

-- ── Admin (password: Admin1234!)
INSERT INTO users (full_name, email, password_hash, phone, role, status) VALUES
('Administrador NORIA',
 'admin@noriafilms.com',
 '$2a$10$JuDSXeSbpsGpq68LurNm6OJnS31YNbttfnjgBAbGQKhioDSbybxC2',
 '+52 449 000 0000',
 'admin', 'active');

-- ── 8 Servicios reales del cliente
INSERT INTO services (name, description, base_price, icon, image_url, active) VALUES
('Reel para redes',
 'Producción de reels profesionales para redes sociales: Instagram, TikTok, YouTube Shorts.',
 1500.00, 'RS',
 'https://images.unsplash.com/photo-1611162617213-7d7a39e9b1d7?w=600&q=80', 1),

('Sesión fotográfica',
 'Sesión de fotografía profesional para retrato, producto, evento o contenido editorial.',
 1000.00, 'SF',
 'https://images.unsplash.com/photo-1554048612-b6a482bc67e5?w=600&q=80', 1),

('Videoclip',
 'Producción integral de videoclips artísticos con concepto visual, dirección de arte y postproducción.',
 8000.00, 'VC',
 'https://images.unsplash.com/photo-1637250096679-c10f2751def8?w=600&q=80', 1),

('Videodanza',
 'Registro y producción audiovisual de piezas de danza contemporánea, ballet y artes escénicas.',
 8000.00, 'VD',
 'https://images.unsplash.com/photo-1508700115892-45ecd05ae2ad?w=600&q=80', 1),

('Comercial',
 'Producción de spots publicitarios para televisión, medios digitales y campañas de marca.',
 12000.00, 'CM',
 'https://images.unsplash.com/photo-1611784728558-6c7d9b409cdf?w=600&q=80', 1),

('Cobertura de evento',
 'Registro profesional de eventos: conciertos, conferencias, bodas corporativas y ceremonias.',
 5000.00, 'EV',
 'https://images.unsplash.com/photo-1603126004372-e63e3b53934b?w=600&q=80', 1),

('Video institucional',
 'Video corporativo que comunica identidad, valores y propuesta de valor de tu organización.',
 9000.00, 'VI',
 'https://images.unsplash.com/photo-1560179707-f14e90ef3623?w=600&q=80', 1),

('Cortometraje',
 'Desarrollo completo de proyectos cinematográficos de corta duración: guión, casting, rodaje y postproducción.',
 25000.00, 'CT',
 'https://images.unsplash.com/photo-1625690303837-654c9666d2d0?w=600&q=80', 1);
