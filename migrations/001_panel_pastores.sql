-- ============================================
-- TuWebIglesia — Migración: Panel de Pastores
-- Ejecutar con: DATABASE_URL="postgresql://postgres:...@caboose.proxy.rlwy.net:28461/railway" node migrations/run-migration.js
-- ============================================

-- 1. Catálogo maestro de secciones
CREATE TABLE IF NOT EXISTS secciones_catalogo (
  id SERIAL PRIMARY KEY,
  slug VARCHAR(50) UNIQUE NOT NULL,
  nombre VARCHAR(100) NOT NULL,
  descripcion TEXT,
  orden INTEGER DEFAULT 0
);

INSERT INTO secciones_catalogo (slug, nombre, descripcion, orden) VALUES
  ('hero', 'Portada principal', 'Imagen de portada, nombre y lema de la iglesia', 1),
  ('horarios', 'Horarios de culto', 'Días y horas de los servicios', 2),
  ('nosotros', 'Quiénes somos', 'Historia y visión de la iglesia', 3),
  ('predicaciones', 'Predicaciones', 'Últimas predicaciones y predicadores', 4),
  ('eventos', 'Eventos', 'Próximos eventos y actividades', 5),
  ('ministerios', 'Ministerios', 'Grupos y ministerios activos', 6),
  ('galeria', 'Galería de fotos', 'Fotos de la iglesia y actividades', 7),
  ('transmision', 'Transmisión en vivo', 'Canal de YouTube y último video', 8),
  ('ubicacion', 'Ubicación', 'Dirección y mapa de Google', 9),
  ('contacto', 'Contacto', 'Teléfono, email y redes sociales', 10),
  ('donaciones', 'Donaciones', 'Información para ofrendas y diezmos', 11)
ON CONFLICT (slug) DO NOTHING;

-- 2. Secciones activas por iglesia (monetización por plan)
CREATE TABLE IF NOT EXISTS secciones_iglesia (
  id SERIAL PRIMARY KEY,
  iglesia_id INTEGER NOT NULL REFERENCES iglesias_aprobadas(id) ON DELETE CASCADE,
  seccion_slug VARCHAR(50) NOT NULL REFERENCES secciones_catalogo(slug),
  activa BOOLEAN DEFAULT true,
  creado_en TIMESTAMP DEFAULT NOW(),
  UNIQUE(iglesia_id, seccion_slug)
);

-- 3. Contenido estructurado (reemplaza HTML estático)
CREATE TABLE IF NOT EXISTS contenido_iglesia (
  id SERIAL PRIMARY KEY,
  iglesia_id INTEGER NOT NULL REFERENCES iglesias_aprobadas(id) ON DELETE CASCADE,
  seccion_slug VARCHAR(50) NOT NULL,
  clave VARCHAR(100) NOT NULL,
  valor TEXT,
  orden INTEGER DEFAULT 0,
  actualizado_en TIMESTAMP DEFAULT NOW(),
  UNIQUE(iglesia_id, seccion_slug, clave)
);

-- Índice para consultas rápidas por iglesia
CREATE INDEX IF NOT EXISTS idx_contenido_iglesia_id ON contenido_iglesia(iglesia_id);

-- 4. Acceso de pastores
CREATE TABLE IF NOT EXISTS pastores_acceso (
  id SERIAL PRIMARY KEY,
  iglesia_id INTEGER NOT NULL REFERENCES iglesias_aprobadas(id) ON DELETE CASCADE,
  usuario VARCHAR(255) NOT NULL UNIQUE,
  password_hash VARCHAR(255) NOT NULL,
  creado_en TIMESTAMP DEFAULT NOW(),
  ultimo_login TIMESTAMP
);

-- 5. Ediciones mensuales (límite por plan)
CREATE TABLE IF NOT EXISTS ediciones_mensuales (
  id SERIAL PRIMARY KEY,
  iglesia_id INTEGER NOT NULL REFERENCES iglesias_aprobadas(id) ON DELETE CASCADE,
  mes VARCHAR(7) NOT NULL,
  conteo INTEGER DEFAULT 0,
  UNIQUE(iglesia_id, mes)
);

-- 6. Agregar columnas a iglesias_aprobadas si no existen
DO $$ BEGIN
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='iglesias_aprobadas' AND column_name='dominio_tipo') THEN
    ALTER TABLE iglesias_aprobadas ADD COLUMN dominio_tipo VARCHAR(20) DEFAULT 'subdominio';
  END IF;
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='iglesias_aprobadas' AND column_name='dominio_valor') THEN
    ALTER TABLE iglesias_aprobadas ADD COLUMN dominio_valor VARCHAR(255);
  END IF;
END $$;
