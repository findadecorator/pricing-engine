const { success, error } = require("../utils/response");
const leadAssignmentService = require("../services/leadAssignmentService");

exports.assignLeadToDecorator = async (req, res) => {
  try {
    const { assigned_to } = req.body;
    const assigned_by = req.user.id;

    const assignment = await leadAssignmentService.assignLeadToDecorator(
      req.params.id,
      assigned_by,
      assigned_to
    );

    return success(res, { assignment }, 201);
  } catch (e) {
    return error(res, e.message, e.status || 500);
  }
};

exports.getAssignmentsForLead = async (req, res) => {
  try {
    const assignments = await leadAssignmentService.getAssignmentsForLead(
      req.params.id
    );

    return success(res, { assignments }, 200);
  } catch (e) {
    return error(res, e.message, e.status || 500);
  }
};
