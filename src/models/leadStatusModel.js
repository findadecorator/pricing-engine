const pool = require("../config/db");

const getAllStatuses = async () => {
  const result = await pool.query(
    `SELECT * FROM lead_status ORDER BY order_index ASC`
  );
  return result.rows;
};

const getStatusByName = async (name) => {
  const result = await pool.query(
    `SELECT * FROM lead_status WHERE name = $1`,
    [name]
  );
  return result.rows[0];
};

const getStatusById = async (id) => {
  const result = await pool.query(
    `SELECT * FROM lead_status WHERE id = $1`,
    [id]
  );
  return result.rows[0];
};

module.exports = {
  getAllStatuses,
  getStatusByName,
  getStatusById
};
