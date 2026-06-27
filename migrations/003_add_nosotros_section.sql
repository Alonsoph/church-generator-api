-- ============================================================
-- TuWebIglesia — Migración 003
-- Agrega sección 'nosotros' al catálogo si no existe
-- Agrega campo 'logo_url' a contenido (para logo dinámico por iglesia)
-- ============================================================

-- Insertar sección nosotros si no existe
INSERT INTO secciones_catalogo (slug, nombre, descripcion, orden)
VALUES ('nosotros', 'Quiénes somos', 'Historia, visión y misión de la iglesia', 3)
ON CONFLICT (slug) DO NOTHING;

-- Reordenar secciones para que nosotros quede en posición 3
UPDATE secciones_catalogo SET orden = 1  WHERE slug = 'hero';
UPDATE secciones_catalogo SET orden = 2  WHERE slug = 'horarios';
UPDATE secciones_catalogo SET orden = 3  WHERE slug = 'nosotros';
UPDATE secciones_catalogo SET orden = 4  WHERE slug = 'predicaciones';
UPDATE secciones_catalogo SET orden = 5  WHERE slug = 'eventos';
UPDATE secciones_catalogo SET orden = 6  WHERE slug = 'ministerios';
UPDATE secciones_catalogo SET orden = 7  WHERE slug = 'galeria';
UPDATE secciones_catalogo SET orden = 8  WHERE slug = 'transmision';
UPDATE secciones_catalogo SET orden = 9  WHERE slug = 'ubicacion';
UPDATE secciones_catalogo SET orden = 10 WHERE slug = 'contacto';
UPDATE secciones_catalogo SET orden = 11 WHERE slug = 'donaciones';

-- Agregar columna logo_url a iglesias_aprobadas si no existe
DO $$ BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name='iglesias_aprobadas' AND column_name='logo_url'
  ) THEN
    ALTER TABLE iglesias_aprobadas ADD COLUMN logo_url VARCHAR(500);
  END IF;
END $$;

-- Índice para búsqueda por dominio_valor
CREATE INDEX IF NOT EXISTS idx_iglesias_dominio_valor
  ON iglesias_aprobadas(dominio_valor);
