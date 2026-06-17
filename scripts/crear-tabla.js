const pool = require('../config/db');

async function crearTabla() {
  try {
    await pool.query(`
      CREATE TABLE IF NOT EXISTS iglesias_aprobadas (
        id SERIAL PRIMARY KEY,
        nombre_iglesia VARCHAR(255) NOT NULL,
        email_contacto VARCHAR(255),
        whatsapp_contacto VARCHAR(50),
        html_generado TEXT NOT NULL,
        sugerencias_cliente TEXT,
        estado VARCHAR(50) DEFAULT 'pendiente_revision',
        fecha_creacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        fecha_aprobacion TIMESTAMP,
        html_final TEXT,
        plan_seleccionado VARCHAR(50),
        dominio_asignado VARCHAR(255),
        link_final VARCHAR(255)
      );
    `);
    console.log('✅ Tabla iglesias_aprobadas creada con éxito');
    process.exit(0);
  } catch (err) {
    console.error('❌ Error creando tabla:', err);
    process.exit(1);
  }
}

crearTabla();