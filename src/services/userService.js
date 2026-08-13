const userModel = require("../models/userModel");
const { NotFoundError } = require("../utils/errors");

const getProfile = async (id) => {
  const user = await userModel.findById(id);
  if (!user) throw new NotFoundError("User not found");
  delete user.password_hash;
  return user;
};

const updateProfile = async (id, data) => {
  const user = await userModel.updateProfile(id, data);
  if (!user) throw new NotFoundError("User not found");
  return user;
};

module.exports = {
  getProfile,
  updateProfile
};
