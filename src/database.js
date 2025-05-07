require('dotenv').config();
const express = require('express');
const mysql = require('mysql2/promise');

const app = express();
const port = process.env.PORT || 3000;

const db = mysql.createPool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASS,
  database: process.env.DB_NAME,
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
});

app.get('/', async (req, res) => {
  try {
    const [rows] = await db.query('SELECT NOW() AS fecha');
    res.json({ status: 'ok', fecha: rows[0].fecha });
  } catch (err) {
    res.status(500).json({ error: 'Error en la base de datos', detalles: err.message });
  }
});

app.listen(port, () => {
  console.log(`API corriendo en puerto ${port}`);
});
