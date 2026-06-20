// Middleware: protege rutas admin con un token simple en header.
// Lee el token desde la variable de entorno ADMIN_TOKEN en Railway.
// El cliente debe enviar: x-admin-token: <el token>

function adminAuth(req, res, next) {
  const tokenEsperado = process.env.ADMIN_TOKEN;

  if (!tokenEsperado) {
    return res.status(500).json({
      exito: false,
      error: 'ADMIN_TOKEN no está configurado en el servidor',
    });
  }

  const tokenRecibido = req.headers['x-admin-token'];

  if (!tokenRecibido || tokenRecibido !== tokenEsperado) {
    return res.status(401).json({
      exito: false,
      error: 'No autorizado',
    });
  }

  next();
}

module.exports = adminAuth;