const pool = require('../config/db');

const createProfile = async (decoratorId, bio, services, pricing, availability, experience) => {
  const result = await pool.query(
    `INSERT INTO decorator_profiles 
     (decorator_id, bio, services, pricing, availability, experience)
     VALUES ($1, $2, $3, $4, $5, $6) RETURNING *`,
    [decoratorId, bio, services, pricing, availability, experience]
  );
  return result.rows[0];
};

const getProfileByDecoratorId = async (decoratorId) => {
  const result = await pool.query(
    'SELECT * FROM decorator_profiles WHERE decorator_id = $1',
    [decoratorId]
  );
  return result.rows[0];
};

const updateProfile = async (decoratorId, bio, services, pricing, availability, experience) => {
  const result = await pool.query(
    `UPDATE decorator_profiles
     SET bio = $2, services = $3, pricing = $4, availability = $5, experience = $6
     WHERE decorator_id = $1
     RETURNING *`,
    [decoratorId, bio, services, pricing, availability, experience]
  );
  return result.rows[0];
};

module.exports = {
  createProfile,
  getProfileByDecoratorId,
  updateProfile
};
