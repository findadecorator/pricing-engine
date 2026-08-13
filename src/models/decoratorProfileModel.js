const db = require('../utils/db');

exports.createProfile = async (decoratorId, bio, services, pricing, availability, experience) => {
  const rows = await db.query(
    `INSERT INTO decorator_profiles 
     (decorator_id, bio, services, pricing, availability, experience)
     VALUES ($1, $2, $3, $4, $5, $6)
     RETURNING *`,
    [decoratorId, bio, services, pricing, availability, experience]
  );
  return rows[0];
};

exports.getProfileByDecoratorId = async (decoratorId) => {
  const rows = await db.query(
    'SELECT * FROM decorator_profiles WHERE decorator_id = $1',
    [decoratorId]
  );
  return rows[0];
};

exports.updateProfile = async (decoratorId, bio, services, pricing, availability, experience) => {
  const rows = await db.query(
    `UPDATE decorator_profiles
     SET bio = $2, services = $3, pricing = $4, availability = $5, experience = $6
     WHERE decorator_id = $1
     RETURNING *`,
    [decoratorId, bio, services, pricing, availability, experience]
  );
  return rows[0];
};
