const express = require('express');
const cors = require('cors');
require('dotenv').config();

const app = express();

app.use(cors({
origin: '*',
methods: ['GET', 'POST', 'OPTIONS'],
allowedHeaders: ['Content-Type'],
}));
app.options('*', cors());
app.use(express.json({ limit: '10mb' }));

const iglesiasRoutes = require('./routes/iglesias');

app.use('/api/iglesias', iglesiasRoutes);


module.exports = app;