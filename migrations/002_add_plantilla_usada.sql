-- Agregar columna plantilla_usada a iglesias_aprobadas
ALTER TABLE iglesias_aprobadas ADD COLUMN IF NOT EXISTS plantilla_usada VARCHAR(50) DEFAULT 'reverente';
