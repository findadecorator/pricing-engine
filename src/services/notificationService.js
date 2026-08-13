const pool = require('../config/db');

const saveNotification = async (userId, type, message) => {
  const result = await pool.query(
    `INSERT INTO notifications (user_id, type, message)
     VALUES ($1, $2, $3) RETURNING *`,
    [userId, type, message]
  );
  return result.rows[0];
};

module.exports = {
  saveNotification
};
