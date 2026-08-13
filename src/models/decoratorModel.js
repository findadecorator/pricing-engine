const pool = require("../config/db");

const createDecorator = async ({ business_name, description, city, owner_user_id }) => {
  const result = await pool.query(
    `INSERT INTO decorators (business_name, description, city, owner_user_id)
     VALUES ($1, $2, $3, $4)
     RETURNING *`,
    [business_name, description || null, city, owner_user_id]
  );
  return result.rows[0];
};

const getAllDecorators = async () => {
  const result = await pool.query(`SELECT * FROM decorators ORDER BY created_at DESC`);
  return result.rows;
};

const getDecoratorById = async (id) => {
  const result = await pool.query(`SELECT * FROM decorators WHERE id = $1`, [id]);
  return result.rows[0];
};

const updateDecorator = async (id, data) => {
  const { business_name, description, city, image_url } = data;

  const result = await pool.query(
    `UPDATE decorators
     SET business_name = $1,
         description = $2,
         city = $3,
         image_url = $4,
         created_at = created_at
     WHERE id = $5
     RETURNING *`,
    [business_name, description, city, image_url, id]
  );

  return result.rows[0];
};

const deleteDecorator = async (id) => {
  await pool.query(`DELETE FROM decorators WHERE id = $1`, [id]);
  return true;
};

module.exports = {
  createDecorator,
  getAllDecorators,
  getDecoratorById,
  updateDecorator,
  deleteDecorator
};
