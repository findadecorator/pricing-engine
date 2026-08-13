const pool = require('../config/db');

const createClient = async (name, email, password) => {
  const result = await pool.query(
    `INSERT INTO clients (name, email, password)
     VALUES ($1, $2, $3) RETURNING *`,
    [name, email, password]
  );
  return result.rows[0];
};

const getClientByEmail = async (email) => {
  const result = await pool.query(
    `SELECT * FROM clients WHERE email = $1`,
    [email]
  );
  return result.rows[0];
};

const getClientById = async (id) => {
  const result = await pool.query(
    `SELECT * FROM clients WHERE id = $1`,
    [id]
  );
  return result.rows[0];
};

module.exports = {
  createClient,
  getClientByEmail,
  getClientById
};
