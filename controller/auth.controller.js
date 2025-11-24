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
    const hashedPassword = await bcrypt.hash(password, salt);

    const newUserQuery = `
      INSERT INTO users (name, email, password, role)
      VALUES ($1, $2, $3, 'customer')
      RETURNING id, name, email, password, role, created_at
    `;

    const { rows } = await db.query(newUserQuery, [name, email, hashedPassword]);

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

    console.error(error);
    res.status(500).json({
      message: 'Internal Server Error',
    });
  }
};

exports.login = async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({
      error: 'Email and password are required!',
    });
  }

  try {
    const query = 'SELECT * FROM users WHERE email = $1';
    const { rows } = await db.query(query, [email]);
    const user = rows[0];

    if (!user) {
      return res.status(401).json({
        error: 'Invalid credential!',
      });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({
        error: 'Invalid credential!',
      });
    }

    const payload = {
      id: user.id,
      role: user.role,
    };

    const token = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '1d' });

    res.json({
      message: 'Login successful',
      token: token,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({
      error: 'Internal server error.',
    });
  }
};
