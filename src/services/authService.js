const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const userModel = require("../models/userModel");
const { ValidationError, AuthError } = require("../utils/errors");

const JWT_SECRET = process.env.JWT_SECRET || "your_jwt_secret_key";
const JWT_EXPIRES_IN = "7d";

const register = async ({ full_name, email, phone, password, role }) => {
  if (!full_name || !email || !password) {
    throw new ValidationError("Missing required fields");
  }

  const allowedRoles = ["user", "decorator"];
  const finalRole = role || "user";
  if (!allowedRoles.includes(finalRole)) {
    throw new ValidationError("Invalid role");
  }

  const existing = await userModel.findByEmail(email);
  if (existing) throw new ValidationError("Email already in use");

  const password_hash = await bcrypt.hash(password, 10);
  const user = await userModel.create({
    full_name,
    email,
    phone,
    password_hash,
    role: finalRole
  });

  const token = jwt.sign(
    { id: user.id, role: user.role },
    JWT_SECRET,
    { expiresIn: JWT_EXPIRES_IN }
  );

  return { user, token };
};

const login = async ({ email, password }) => {
  if (!email || !password) throw new ValidationError("Missing credentials");

  const user = await userModel.findByEmail(email);
  if (!user) throw new AuthError("Invalid email or password");

  const match = await bcrypt.compare(password, user.password_hash);
  if (!match) throw new AuthError("Invalid email or password");

  const token = jwt.sign(
    { id: user.id, role: user.role },
    JWT_SECRET,
    { expiresIn: JWT_EXPIRES_IN }
  );

  delete user.password_hash;

  return { user, token };
};

module.exports = {
  register,
  login
};
