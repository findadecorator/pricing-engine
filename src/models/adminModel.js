const db = require('../utils/db');

exports.getAllDecorators = async () => {
  return await db.query('SELECT * FROM decorators');
};

exports.getAllLeads = async () => {
  return await db.query('SELECT * FROM job_leads');
};

exports.getAllAssignments = async () => {
  return await db.query('SELECT * FROM lead_assignments');
};
