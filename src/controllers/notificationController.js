const db = require('../utils/db');
const { success } = require('../utils/response');

exports.sendNotification = async (req, res, next) => {
  try {
    const { user_id, message } = req.body;

    const rows = await db.query(
      `INSERT INTO notifications (user_id, message)
       VALUES ($1, $2)
       RETURNING *`,
      [user_id, message]
    );

    return success(res, { notification: rows[0] });
  } catch (err) {
    next(err);
  }
};

exports.getNotifications = async (req, res, next) => {
  try {
    const notifications = await db.query('SELECT * FROM notifications ORDER BY id DESC');
    return success(res, { notifications });
  } catch (err) {
    next(err);
  }
};
