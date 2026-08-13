const db = require('../utils/db');
const { success } = require('../utils/response');

exports.getAllUsers = async (req, res, next) => {
  try {
    const users = await db.query('SELECT id, name, email FROM users ORDER BY id DESC');
    return success(res, { users });
  } catch (err) {
    next(err);
  }
};

exports.getAllDecorators = async (req, res, next) => {
  try {
    const decorators = await db.query('SELECT * FROM decorators ORDER BY id DESC');
    return success(res, { decorators });
  } catch (err) {
    next(err);
  }
};

exports.getAllClients = async (req, res, next) => {
  try {
    const clients = await db.query('SELECT * FROM clients ORDER BY id DESC');
    return success(res, { clients });
  } catch (err) {
    next(err);
  }
};
