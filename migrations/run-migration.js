const fs = require('fs');
const path = require('path');
const pool = require('../config/db');

async function runMigration() {
  try {
    const sql1 = fs.readFileSync(path.join(__dirname, '001_panel_pastores.sql'), 'utf8');
    await pool.query(sql1);
    console.log('Migracion 001 OK');

    const sql2 = fs.readFileSync(path.join(__dirname, '002_add_plantilla_usada.sql'), 'utf8');
    await pool.query(sql2);
    console.log('Migracion 002 OK - plantilla_usada agregada');

    const sql3 = fs.readFileSync(path.join(__dirname, '003_add_nosotros_section.sql'), 'utf8');
    await pool.query(sql3);
    console.log('Migracion 003 OK - seccion nosotros + logo_url + indices');
  } catch (err) {
    console.error('Error en migracion:', err.message);
    process.exit(1);
  } finally {
    await pool.end();
  }
}

runMigration();
