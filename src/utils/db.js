const { pool } = require('../config/db');

exports.query = async (sql, params = []) => {
  const result = await pool.query(sql, params);
  return result.rows;
};
