const { success, error } = require("../utils/response");
const authService = require("../services/authService");

exports.register = async (req, res) => {
  try {
    const { user, token } = await authService.register(req.body);
    return success(res, { user, token }, 201);
  } catch (e) {
    return error(res, e.message || "Registration failed", e.status || 500);
  }
};

exports.login = async (req, res) => {
  try {
    const { user, token } = await authService.login(req.body);
    return success(res, { user, token }, 200);
  } catch (e) {
    return error(res, e.message || "Login failed", e.status || 500);
  }
};
