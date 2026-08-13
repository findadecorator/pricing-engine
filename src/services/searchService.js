const pool = require('../config/db');

const searchDecorators = async (city, service, minRating) => {
  let query = `
    SELECT d.*, 
           dp.services, dp.pricing, dp.availability, dp.experience,
           COALESCE(AVG(r.rating), 0) AS average_rating
    FROM decorators d
    LEFT JOIN decorator_profiles dp ON dp.decorator_id = d.id
    LEFT JOIN reviews r ON r.decorator_id = d.id
    WHERE 1 = 1
  `;

  const params = [];

  if (city) {
    params.push(city);
    query += ` AND LOWER(d.city) = LOWER($${params.length})`;
  }

  if (service) {
    params.push(`%${service}%`);
    query += ` AND LOWER(dp.services) LIKE LOWER($${params.length})`;
  }

  query += ` GROUP BY d.id, dp.services, dp.pricing, dp.availability, dp.experience`;

  if (minRating) {
    params.push(minRating);
    query += ` HAVING AVG(r.rating) >= $${params.length}`;
  }

  const result = await pool.query(query, params);
  return result.rows;
};

module.exports = {
  searchDecorators
};
