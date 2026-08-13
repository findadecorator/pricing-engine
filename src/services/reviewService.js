const pool = require('../config/db');

const addReview = async (decoratorId, clientName, rating, reviewText) => {
  const result = await pool.query(
    `INSERT INTO reviews (decorator_id, client_name, rating, review_text)
     VALUES ($1, $2, $3, $4) RETURNING *`,
    [decoratorId, clientName, rating, reviewText]
  );
  return result.rows[0];
};

const getReviewsForDecorator = async (decoratorId) => {
  const result = await pool.query(
    `SELECT * FROM reviews WHERE decorator_id = $1`,
    [decoratorId]
  );
  return result.rows;
};

const getAverageRating = async (decoratorId) => {
  const result = await pool.query(
    `SELECT AVG(rating) AS average_rating
     FROM reviews
     WHERE decorator_id = $1`,
    [decoratorId]
  );
  return result.rows[0];
};

module.exports = {
  addReview,
  getReviewsForDecorator,
  getAverageRating
};
