const jobLeadModel = require("../models/jobLeadModel");
const leadStatusModel = require("../models/leadStatusModel");
const leadAssignmentModel = require("../models/leadAssignmentModel");
const { NotFoundError, ValidationError } = require("../utils/errors");

const createLead = async (data) => {
  const { client_id, decorator_id, budget, description } = data;

  if (!client_id) throw new ValidationError("client_id is required");

  // Default status = "new"
  const status = await leadStatusModel.getStatusByName("new");

  const lead = await jobLeadModel.createLead({
    client_id,
    decorator_id,
    status_id: status.id,
    budget,
    description
  });

  return lead;
};

const updateLeadStatus = async (lead_id, status_name) => {
  const lead = await jobLeadModel.getLeadById(lead_id);
  if (!lead) throw new NotFoundError("Lead not found");

  const status = await leadStatusModel.getStatusByName(status_name);
  if (!status) throw new ValidationError("Invalid status");

  const updated = await jobLeadModel.updateLeadStatus(lead_id, status.id);
  return updated;
};

const assignLead = async (lead_id, assigned_by, assigned_to) => {
  const lead = await jobLeadModel.getLeadById(lead_id);
  if (!lead) throw new NotFoundError("Lead not found");

  // Update decorator on job_leads table
  await jobLeadModel.assignDecorator(lead_id, assigned_to);

  // Create assignment log
  const assignment = await leadAssignmentModel.assignLeadToDecorator(
    lead_id,
    assigned_by,
    assigned_to
  );

  return {
    lead_id,
    assigned_to,
    assignment
  };
};

const getLeadById = async (id) => {
  const lead = await jobLeadModel.getLeadById(id);
  if (!lead) throw new NotFoundError("Lead not found");
  return lead;
};

const getLeadsForDecorator = async (decorator_id) => {
  return await jobLeadModel.getLeadsForDecorator(decorator_id);
};

const getLeadsForClient = async (client_id) => {
  return await jobLeadModel.getLeadsForClient(client_id);
};

const getAllLeads = async () => {
  return await jobLeadModel.getAllLeads();
};

module.exports = {
  createLead,
  updateLeadStatus,
  assignLead,
  getLeadById,
  getLeadsForDecorator,
  getLeadsForClient,
  getAllLeads
};
