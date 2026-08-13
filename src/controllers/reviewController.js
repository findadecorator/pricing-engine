const db = require('../utils/db');
const { success, error } = require('../utils/response');

// ADD REVIEW
exports.addReview = async (req, res, next) => {
  try {
    const { decorator_id, client_id, rating, comment } = req.body;

    const rows = await db.query(
      `INSERT INTO reviews (decorator_id, client_id, rating, comment)
       VALUES ($1, $2, $3, $4)
       RETURNING *`,
      [decorator_id, client_id, rating, comment]
    );

    return success(res, { review: rows[0] });
  } catch (err) {
    next(err);
  }
};

// GET REVIEWS FOR DECORATOR
exports.getReviewsForDecorator = async (req, res, next) => {
  try {
    const reviews = await db.query(
      `SELECT * FROM reviews
       WHERE decorator_id = $1
       ORDER BY id DESC`,
      [req.params.decoratorId]
    );

    return success(res, { reviews });
  } catch (err) {
    next(err);
  }
};
