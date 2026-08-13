"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.requireAuth = requireAuth;
exports.verifyToken = verifyToken;
exports.signToken = signToken;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const JWT_SECRET = process.env.JWT_SECRET || 'your_jwt_secret_key';
/** HTTP route auth middleware — attaches req.user or returns 401. */
function requireAuth(req, res, next) {
    const header = req.headers.authorization;
    if (!header) {
        res.status(401).json({ error: 'No token provided' });
        return;
    }
    const token = header.split(' ')[1];
    if (!token) {
        res.status(401).json({ error: 'Invalid authorization header' });
        return;
    }
    try {
        const decoded = jsonwebtoken_1.default.verify(token, JWT_SECRET);
        req.user = decoded;
        next();
    }
    catch {
        res.status(401).json({ error: 'Invalid or expired token' });
    }
}
/** Verify a raw JWT string — used by the WS handshake. Returns the payload or null. */
function verifyToken(token) {
    try {
        return jsonwebtoken_1.default.verify(token, JWT_SECRET);
    }
    catch {
        return null;
    }
}
/** Generate a signed JWT — used by login/seed endpoints. */
function signToken(payload) {
    return jsonwebtoken_1.default.sign(payload, JWT_SECRET, { expiresIn: '7d' });
}
exports.default = requireAuth;
