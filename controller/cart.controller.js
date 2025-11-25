const pool = require('../config/db');

exports.addToCart = async (req, res) => {
  const { product_id, quantity } = req.body;
  const user_id = req.user.id;

  if (!product_id || !quantity) {
    return res.status(400).json({
      message: 'Product ID dan Quantity wajib diisi',
    });
  }

  try {
    let cartResult = await pool.query('SELECT id FROM carts WHERE user_id = $1', [user_id]);
    let cart_id;

    if (cartResult.rows.length === 0) {
      const newCart = await pool.query('INSERT INTO carts (user_id) VALUES ($1) RETURNING id', [user_id]);
      cart_id = newCart.rows[0].id;
    } else {
      cart_id = cartResult.rows[0].id;
    }

    const itemCheck = await pool.query('SELECT * FROM cart_itmes WHERE cart_id = $1 AND product_id = $2', [
      cart_id,
      product_id,
    ]);

    if (itemCheck.rows.length > 0) {
      await pool.query('UPDATE cart_itmes SET quantity = quantity + $1 WHERE cart_id = $2 AND product_id = $3', [
        quantity,
        cart_id,
        product_id,
      ]);

      res.status(200).json({ message: 'Jumlah barang di keranjang berhasil diupdate!' });
    } else {
      await pool.query('INSERT INTO cart_itmes (cart_id, product_id, quantity) VALUES ($1, $2, $3)', [
        cart_id,
        product_id,
        quantity,
      ]);

      res.status(200).json({ message: 'Barang berhasil dimasukkan ke keranjang!' });
    }
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ error: 'Server error!' });
  }
};
