require('dotenv').config();
const express = require('express');
const cors = require('cors');
const db = require('./config/db');

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Routes
app.get('/', (req, res) => {
  res.json({ message: 'Selamat datang di API toko kopi' });
});

// Endpoint test
app.get('/test-db', async (req, res) => {
  try {
    const result = await db.query('SELECT * FROM users');
    res.json({
      message: 'Koneksi database BERHASIL dan tabel users ditemukan',
      rowCount: result.rowCount,
    });
  } catch (err) {
    res.status(500).json({
      message: 'Koneksi database GAGAL',
      error: err.message,
    });
  }
});

// Server Start
app.listen(PORT, () => {
  console.log(`Server Toko Kopi API berjalan di http://localhost:${PORT}`);
});
