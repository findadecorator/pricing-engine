const db = require('../utils/db');
const { success } = require('../utils/response');

// SERVER TEST
exports.pingServer = (req, res) => {
  return success(res, { message: 'Server is running' });
};

// DATABASE TEST
exports.pingDB = async (req, res, next) => {
  try {
    const rows = await db.query('SELECT NOW()');
    return success(res, { time: rows[0].now });
  } catch (err) {
    next(err);
  }
};
