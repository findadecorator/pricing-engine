const pool = require("../config/db");

const findByEmail = async (email) => {
  const result = await pool.query(
    "SELECT * FROM users WHERE email = $1",
    [email]
  );
  return result.rows[0] || null;
};

const findById = async (id) => {
  const result = await pool.query(
    "SELECT * FROM users WHERE id = $1",
    [id]
  );
  return result.rows[0] || null;
};

const create = async ({ full_name, email, phone, password_hash, role }) => {
  const result = await pool.query(
    `INSERT INTO users (full_name, email, phone, password_hash, role)
     VALUES ($1, $2, $3, $4, $5)
     RETURNING id, full_name, email, phone, role, created_at`,
    [full_name, email, phone || null, password_hash, role]
  );
  return result.rows[0];
};

const updateProfile = async (id, { full_name, phone }) => {
  const result = await pool.query(
    `UPDATE users
     SET full_name = COALESCE($1, full_name),
         phone = COALESCE($2, phone)
     WHERE id = $3
     RETURNING id, full_name, email, phone, role, created_at`,
    [full_name || null, phone || null, id]
  );
  return result.rows[0] || null;
};

module.exports = {
  findByEmail,
  findById,
  create,
  updateProfile
};
