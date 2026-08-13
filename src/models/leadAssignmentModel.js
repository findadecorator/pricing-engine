const pool = require("../config/db");

const assignLeadToDecorator = async (lead_id, assigned_by, assigned_to) => {
  const result = await pool.query(
    `INSERT INTO lead_assignments (lead_id, assigned_by, assigned_to)
     VALUES ($1, $2, $3)
     RETURNING *`,
    [lead_id, assigned_by, assigned_to]
  );
  return result.rows[0];
};

const getAssignmentsForLead = async (lead_id) => {
  const result = await pool.query(
    `SELECT * FROM lead_assignments WHERE lead_id = $1 ORDER BY created_at DESC`,
    [lead_id]
  );
  return result.rows;
};

module.exports = {
  assignLeadToDecorator,
  getAssignmentsForLead
};
