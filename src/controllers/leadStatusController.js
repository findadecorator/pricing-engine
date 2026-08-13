const { success, error } = require("../utils/response");
const leadStatusService = require("../services/leadStatusService");

exports.getAllStatuses = async (req, res) => {
  try {
    const statuses = await leadStatusService.getAllStatuses();
    return success(res, { statuses }, 200);
  } catch (e) {
    return error(res, e.message, e.status || 500);
  }
};

exports.getStatusByName = async (req, res) => {
  try {
    const status = await leadStatusService.getStatusByName(req.params.name);
    return success(res, { status }, 200);
  } catch (e) {
    return error(res, e.message, e.status || 500);
  }
};

exports.getStatusById = async (req, res) => {
  try {
    const status = await leadStatusService.getStatusById(req.params.id);
    return success(res, { status }, 200);
  } catch (e) {
    return error(res, e.message, e.status || 500);
  }
};
