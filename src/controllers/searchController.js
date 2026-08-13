const db = require('../utils/db');
const { success } = require('../utils/response');

// SEARCH DECORATORS
exports.searchDecorators = async (req, res, next) => {
  try {
    const { q } = req.query;

    const decorators = await db.query(
      `SELECT * FROM decorators
       WHERE name ILIKE $1 OR skills ILIKE $1`,
      [`%${q}%`]
    );

    return success(res, { decorators });
  } catch (err) {
    next(err);
  }
};

// SEARCH CLIENTS
exports.searchClients = async (req, res, next) => {
  try {
    const { q } = req.query;

    const clients = await db.query(
      `SELECT * FROM clients
       WHERE name ILIKE $1 OR email ILIKE $1`,
      [`%${q}%`]
    );

    return success(res, { clients });
  } catch (err) {
    next(err);
  }
};

// SEARCH LEADS
exports.searchLeads = async (req, res, next) => {
  try {
    const { q } = req.query;

    const leads = await db.query(
      `SELECT * FROM job_leads
       WHERE description ILIKE $1`,
      [`%${q}%`]
    );

    return success(res, { leads });
  } catch (err) {
    next(err);
  }
};
