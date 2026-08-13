const leadAssignmentModel = require("../models/leadAssignmentModel");
const jobLeadModel = require("../models/jobLeadModel");
const { NotFoundError } = require("../utils/errors");

const assignLeadToDecorator = async (lead_id, assigned_by, assigned_to) => {
  const lead = await jobLeadModel.getLeadById(lead_id);
  if (!lead) throw new NotFoundError("Lead not found");

  const assignment = await leadAssignmentModel.assignLeadToDecorator(
    lead_id,
    assigned_by,
    assigned_to
  );

  return assignment;
};

const getAssignmentsForLead = async (lead_id) => {
  const lead = await jobLeadModel.getLeadById(lead_id);
  if (!lead) throw new NotFoundError("Lead not found");

  return await leadAssignmentModel.getAssignmentsForLead(lead_id);
};

module.exports = {
  assignLeadToDecorator,
  getAssignmentsForLead
};
