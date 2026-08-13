const db = require('../utils/db');

exports.saveNotification = async (userId, type, message) => {
  const rows = await db.query(
    `INSERT INTO notifications (user_id, type, message)
     VALUES ($1, $2, $3)
     RETURNING *`,
    [userId, type, message]
  );
  return rows[0];
};
