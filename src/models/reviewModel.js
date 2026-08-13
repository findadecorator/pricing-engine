const db = require('../utils/db');

exports.addReview = async (decoratorId, clientName, rating, reviewText) => {
  const rows = await db.query(
    `INSERT INTO reviews (decorator_id, client_name, rating, review_text)
     VALUES ($1, $2, $3, $4)
     RETURNING *`,
    [decoratorId, clientName, rating, reviewText]
  );
  return rows[0];
};

exports.getReviewsForDecorator = async (decoratorId) => {
  return await db.query(
    `SELECT * FROM reviews WHERE decorator_id = $1`,
    [decoratorId]
  );
};

exports.getAverageRating = async (decoratorId) => {
  const rows = await db.query(
    `SELECT AVG(rating) AS average_rating
     FROM reviews
     WHERE decorator_id = $1`,
    [decoratorId]
  );
  return rows[0];
};
