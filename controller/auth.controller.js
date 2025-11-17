const db = require('../config/db');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

exports.register = async (req, res) => {
  const { name, email, password } = req.body;

  if (!name || !email || !password) {
    return res.status(400).json({
      message: 'Name, Emial, and Password must be fill!',
    });
  }

  try {
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password.salt);

    const newUserQuery = `
      INSERT INTO users (name, email, password, role)
      VALUES ($1, $2, $3, 'customer')
      RETURNING id, name, email, password, role, created_at
    `;

    const { rows } = await db.query(newUserQuery, [name, hashedPassword, email]);

    res.status(200).json({
      message: 'User registered successfully',
      user: rows[0],
    });
  } catch (error) {
    if (error.code === '23505') {
      return res.status(409).json({
        error: 'Email already exsists.',
      });
    }
  }
};

exports.login = async (req, res) => {
  res.json({
    message: 'Login endpoint',
  });
};
