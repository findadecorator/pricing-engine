const db = require('../utils/db');
const { success, error } = require('../utils/response');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

exports.registerClient = async (req, res, next) => {
  try {
    const { name, email, password } = req.body;

    const existing = await db.query('SELECT id FROM clients WHERE email = $1', [email]);
    if (existing.length > 0) return error(res, 'Email already registered', 400);

    const hashed = await bcrypt.hash(password, 10);

    const rows = await db.query(
      `INSERT INTO clients (name, email, password)
       VALUES ($1, $2, $3)
       RETURNING id, name, email`,
      [name, email, hashed]
    );

    return success(res, { client: rows[0] });
  } catch (err) {
    next(err);
  }
};

exports.loginClient = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    const rows = await db.query('SELECT * FROM clients WHERE email = $1', [email]);
    if (rows.length === 0) return error(res, 'Client not found', 404);

    const client = rows[0];
    const match = await bcrypt.compare(password, client.password);
    if (!match) return error(res, 'Invalid password', 400);

    const token = jwt.sign({ id: client.id }, process.env.JWT_SECRET, { expiresIn: '7d' });

    return success(res, {
      token,
      client: { id: client.id, name: client.name, email: client.email }
    });
  } catch (err) {
    next(err);
  }
};

exports.getClientProfile = async (req, res, next) => {
  try {
    const rows = await db.query(
      'SELECT id, name, email FROM clients WHERE id = $1',
      [req.params.id]
    );

    if (rows.length === 0) return error(res, 'Client not found', 404);

    return success(res, { client: rows[0] });
  } catch (err) {
    next(err);
  }
};
