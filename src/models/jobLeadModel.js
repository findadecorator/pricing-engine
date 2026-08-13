const pool = require("../config/db");

const createLead = async ({
  client_id,
  decorator_id,
  status_id,
  budget,
  description
}) => {
  const result = await pool.query(
    `INSERT INTO job_leads (client_id, decorator_id, status_id, budget, description)
     VALUES ($1, $2, $3, $4, $5)
     RETURNING *`,
    [client_id, decorator_id || null, status_id || null, budget || null, description || null]
  );
  return result.rows[0];
};

const updateLeadStatus = async (id, status_id) => {
  const result = await pool.query(
    `UPDATE job_leads
     SET status_id = $1, updated_at = NOW()
     WHERE id = $2
     RETURNING *`,
    [status_id, id]
  );
  return result.rows[0];
};

const assignDecorator = async (id, decorator_id) => {
  const result = await pool.query(
    `UPDATE job_leads
     SET decorator_id = $1, updated_at = NOW()
     WHERE id = $2
     RETURNING *`,
    [decorator_id, id]
  );
  return result.rows[0];
};

const getLeadById = async (id) => {
  const result = await pool.query(
    `SELECT * FROM job_leads WHERE id = $1`,
    [id]
  );
  return result.rows[0];
};

const getLeadsForDecorator = async (decorator_id) => {
  const result = await pool.query(
    `SELECT * FROM job_leads WHERE decorator_id = $1 ORDER BY created_at DESC`,
    [decorator_id]
  );
  return result.rows;
};

const getLeadsForClient = async (client_id) => {
  const result = await pool.query(
    `SELECT * FROM job_leads WHERE client_id = $1 ORDER BY created_at DESC`,
    [client_id]
  );
  return result.rows;
};

const getAllLeads = async () => {
  const result = await pool.query(
    `SELECT * FROM job_leads ORDER BY created_at DESC`
  );
  return result.rows;
};

module.exports = {
  createLead,
  updateLeadStatus,
  assignDecorator,
  getLeadById,
  getLeadsForDecorator,
  getLeadsForClient,
  getAllLeads
};
