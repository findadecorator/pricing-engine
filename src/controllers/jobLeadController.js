const { success, error } = require("../utils/response");
const jobLeadService = require("../services/jobLeadService");

exports.createLead = async (req, res) => {
  try {
    const lead = await jobLeadService.createLead(req.body);
    return success(res, { lead }, 201);
  } catch (e) {
    return error(res, e.message, e.status || 500);
  }
};

exports.updateLeadStatus = async (req, res) => {
  try {
    const { status } = req.body;
    const lead = await jobLeadService.updateLeadStatus(req.params.id, status);
    return success(res, { lead }, 200);
  } catch (e) {
    return error(res, e.message, e.status || 500);
  }
};

exports.assignLead = async (req, res) => {
  try {
    const { assigned_to } = req.body;
    const assigned_by = req.user.id;

    const result = await jobLeadService.assignLead(
      req.params.id,
      assigned_by,
      assigned_to
    );

    return success(res, result, 200);
  } catch (e) {
    return error(res, e.message, e.status || 500);
  }
};

exports.getLeadById = async (req, res) => {
  try {
    const lead = await jobLeadService.getLeadById(req.params.id);
    return success(res, { lead }, 200);
  } catch (e) {
    return error(res, e.message, e.status || 500);
  }
};

exports.getLeadsForDecorator = async (req, res) => {
  try {
    const leads = await jobLeadService.getLeadsForDecorator(req.params.id);
    return success(res, { leads }, 200);
  } catch (e) {
    return error(res, e.message, e.status || 500);
  }
};

exports.getLeadsForClient = async (req, res) => {
  try {
    const leads = await jobLeadService.getLeadsForClient(req.params.id);
    return success(res, { leads }, 200);
  } catch (e) {
    return error(res, e.message, e.status || 500);
  }
};

exports.getAllLeads = async (req, res) => {
  try {
    const leads = await jobLeadService.getAllLeads();
    return success(res, { leads }, 200);
  } catch (e) {
    return error(res, e.message, e.status || 500);
  }
};
