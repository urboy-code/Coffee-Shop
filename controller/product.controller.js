const pool = require('../config/db');

exports.getAllProducts = async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM products');
    res.json({
      message: 'Daftar produk berhasil diambil',
      data: result.rows,
    });
  } catch (err) {
    res.status(500).json({
      message: 'Internal server error',
      error: err.message,
    });
  }
};

exports.createProduct = async (req, res) => {
  const { name, description, price, stock, image_url } = req.body;

  if (!name || !price) {
    return res.status(400).json({
      message: 'Nama dan Harga wajib diisi',
    });
  }

  try {
    const query = `
    INSERT INTO products (name, description, price, stock, image_url)
    VALUES ($1, $2, $3, $4, $5)
    RETURNING *
    `;

    const value = [name, description, price, stock || 0, image_url || null];

    const result = await pool.query(query, value);

    res.status(200).json({
      message: 'Produk berhasil ditambahkan',
      data: result.rows[0],
    });
  } catch (err) {
    console.error(err.message);
    res.status(500).json({
      message: 'Gagal menambahlan produk',
      error: err.message,
    });
  }
};
