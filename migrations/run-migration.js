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
  } catch (err) {
    console.error('Error:', err.message);
  } finally {
    await pool.end();
  }
}

runMigration();
