const jwt = require("jsonwebtoken");
const { AuthError } = require("../utils/errors");

const JWT_SECRET = process.env.JWT_SECRET || "your_jwt_secret_key";

module.exports = (req, res, next) => {
  const header = req.headers.authorization;
  if (!header) return next(new AuthError("No token provided"));

  const token = header.split(" ")[1];
  if (!token) return next(new AuthError("Invalid authorization header"));

  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    req.user = decoded;
    next();
  } catch (err) {
    next(new AuthError("Invalid token"));
  }
};
