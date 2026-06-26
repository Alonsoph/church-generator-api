// middleware/panelAuth.js
const jwt = require('jsonwebtoken');

const JWT_SECRET = process.env.JWT_SECRET || process.env.ADMIN_TOKEN || 'tuwebiglesia-panel-secret-2026';

function panelAuth(req, res, next) {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ error: 'Acceso no autorizado' });
  }

  const token = authHeader.split(' ')[1];

  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    // decoded contiene: { iglesiaId, usuario, plan }
    req.pastor = decoded;
    next();
  } catch (err) {
    return res.status(401).json({ error: 'Sesión expirada, inicie sesión nuevamente' });
  }
}

module.exports = { panelAuth, JWT_SECRET };
