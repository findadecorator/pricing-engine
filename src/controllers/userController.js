const { success, error } = require("../utils/response");
const userService = require("../services/userService");

exports.getProfile = async (req, res) => {
  try {
    const user = await userService.getProfile(req.user.id);
    return success(res, { user }, 200);
  } catch (e) {
    return error(res, e.message || "Profile fetch failed", e.status || 500);
  }
};

exports.updateProfile = async (req, res) => {
  try {
    const user = await userService.updateProfile(req.user.id, req.body);
    return success(res, { user }, 200);
  } catch (e) {
    return error(res, e.message || "Profile update failed", e.status || 500);
  }
};
