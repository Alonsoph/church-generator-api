// migrations/run-migration.js
// Uso: DATABASE_URL="postgresql://postgres:...@caboose.proxy.rlwy.net:28461/railway" node migrations/run-migration.js

const fs = require('fs');
const path = require('path');
const pool = require('../config/db');

async function runMigration() {
  const sqlPath = path.join(__dirname, '001_panel_pastores.sql');
  const sql = fs.readFileSync(sqlPath, 'utf8');

  try {
    await pool.query(sql);
    console.log('✅ Migración ejecutada correctamente');
    console.log('   - secciones_catalogo (11 secciones insertadas)');
    console.log('   - secciones_iglesia');
    console.log('   - contenido_iglesia');
    console.log('   - pastores_acceso');
    console.log('   - ediciones_mensuales');
    console.log('   - Columnas dominio_tipo y dominio_valor en iglesias_aprobadas');
  } catch (err) {
    console.error('❌ Error en migración:', err.message);
  } finally {
    await pool.end();
  }
}

runMigration();
