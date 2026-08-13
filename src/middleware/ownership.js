const pool = require("../config/db");
const { ForbiddenError, NotFoundError } = require("../utils/errors");

module.exports = async (req, res, next) => {
  const decoratorId = req.params.id;
  const userId = req.user.id;
  const role = req.user.role;

  if (role === "admin" || role === "superadmin") return next();

  try {
    const result = await pool.query(
      "SELECT owner_user_id, owner_decorator_id FROM decorators WHERE id = $1",
      [decoratorId]
    );

    if (result.rowCount === 0) return next(new NotFoundError("Decorator not found"));

    const row = result.rows[0];

    if (role === "user" && row.owner_user_id === userId) return next();
    if (role === "decorator" && row.owner_decorator_id === userId) return next();

    return next(new ForbiddenError("You do not own this decorator"));
  } catch (e) {
    next(e);
  }
};
