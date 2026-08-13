const leadStatusModel = require("../models/leadStatusModel");
const { NotFoundError } = require("../utils/errors");

const getAllStatuses = async () => {
  return await leadStatusModel.getAllStatuses();
};

const getStatusByName = async (name) => {
  const status = await leadStatusModel.getStatusByName(name);
  if (!status) throw new NotFoundError("Status not found");
  return status;
};

const getStatusById = async (id) => {
  const status = await leadStatusModel.getStatusById(id);
  if (!status) throw new NotFoundError("Status not found");
  return status;
};

module.exports = {
  getAllStatuses,
  getStatusByName,
  getStatusById
};
