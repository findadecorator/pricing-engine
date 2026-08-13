const db = require('../utils/db');

exports.createClient = async (name, email, password) => {
  const rows = await db.query(
    `INSERT INTO clients (name, email, password)
     VALUES ($1, $2, $3)
     RETURNING *`,
    [name, email, password]
  );
  return rows[0];
};

exports.getClientByEmail = async (email) => {
  const rows = await db.query(
    `SELECT * FROM clients WHERE email = $1`,
    [email]
  );
  return rows[0];
};

exports.getClientById = async (id) => {
  const rows = await db.query(
    `SELECT * FROM clients WHERE id = $1`,
    [id]
  );
  return rows[0];
};
