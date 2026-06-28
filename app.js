const express = require('express');
const cors = require('cors');
require('dotenv').config();

const app = express();

app.use(cors({
  origin: '*',
  methods: ['GET', 'POST', 'PATCH', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'x-admin-token'],
}));
app.options('*', cors());
app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true }));

// Servir archivos estáticos (logos OG, imágenes)
app.use(express.static('public'));

const iglesiasRoutes = require('./routes/iglesias');
app.use('/api/iglesias', iglesiasRoutes);

const misionerosRouter = require('./routes/misioneros');
app.use('/api/misioneros', misionerosRouter);

const pagosRouter = require("./routes/pagos");
app.use("/api/pagos/flow", pagosRouter);

const marketingRouter = require("./routes/marketing");
app.use("/api/marketing", marketingRouter);

const panelRoutes = require('./routes/panel');
const webRoutes = require('./routes/web');
app.use('/api/web', webRoutes);
app.use('/api/panel', panelRoutes);

module.exports = app;