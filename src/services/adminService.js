const pool = require('../config/db');

const getAllDecorators = async () => {
  const result = await pool.query('SELECT * FROM decorators');
  return result.rows;
};

const getAllLeads = async () => {
  const result = await pool.query('SELECT * FROM job_leads');
  return result.rows;
};

const getAllAssignments = async () => {
  const result = await pool.query('SELECT * FROM lead_assignments');
  return result.rows;
};

module.exports = {
  getAllDecorators,
  getAllLeads,
  getAllAssignments
};
