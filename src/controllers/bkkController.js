const db = require('../utils/db');
const { success, error } = require('../utils/response');

exports.getAllBkk = async (req, res, next) => {
  try {
    const items = await db.query('SELECT * FROM bkk ORDER BY id DESC');
    return success(res, { items });
  } catch (err) {
    next(err);
  }
};

exports.getSingleBkk = async (req, res, next) => {
  try {
    const rows = await db.query('SELECT * FROM bkk WHERE id = $1', [req.params.id]);
    if (rows.length === 0) return error(res, 'Item not found', 404);
    return success(res, { item: rows[0] });
  } catch (err) {
    next(err);
  }
};

exports.createBkk = async (req, res, next) => {
  try {
    const { audio, status, assigned_to } = req.body;

    const rows = await db.query(
      `INSERT INTO bkk (audio, status, assigned_to)
       VALUES ($1, $2, $3)
       RETURNING *`,
      [audio, status || 'pending', assigned_to || 'none']
    );

    return success(res, { item: rows[0] });
  } catch (err) {
    next(err);
  }
};

exports.updateBkk = async (req, res, next) => {
  try {
    const { audio, status, assigned_to } = req.body;

    const rows = await db.query(
      `UPDATE bkk
       SET audio = COALESCE($1, audio),
           status = COALESCE($2, status),
           assigned_to = COALESCE($3, assigned_to)
       WHERE id = $4
       RETURNING *`,
      [audio, status, assigned_to, req.params.id]
    );

    return success(res, { item: rows[0] });
  } catch (err) {
    next(err);
  }
};

exports.deleteBkk = async (req, res, next) => {
  try {
    await db.query('DELETE FROM bkk WHERE id = $1', [req.params.id]);
    return success(res, { message: 'Item deleted' });
  } catch (err) {
    next(err);
  }
};
