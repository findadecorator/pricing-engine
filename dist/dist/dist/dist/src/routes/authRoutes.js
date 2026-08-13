"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const client_1 = require("@prisma/client");
const auth_1 = require("../middleware/auth");
const router = (0, express_1.Router)();
const prisma = new client_1.PrismaClient();
/** POST /api/auth/login — returns a signed JWT for the given email.
 *  In production this would verify a password; here it issues a token
 *  for any existing user (or the demo user) so WS auth can be tested. */
router.post('/login', async (req, res) => {
    const { email } = req.body;
    if (!email)
        return res.status(400).json({ error: 'email required' });
    try {
        await prisma.$connect();
        const user = await prisma.user.findUnique({ where: { email } });
        if (!user)
            return res.status(404).json({ error: 'User not found' });
        const token = (0, auth_1.signToken)({ id: user.id, email: user.email, plan: user.plan ?? 'STARTER' });
        return res.json({ token, userId: user.id, email: user.email });
    }
    catch (err) {
        // Fallback for demo/fallback mode when DB is unavailable
        const token = (0, auth_1.signToken)({ id: 'demo-1', email, plan: 'GROWTH' });
        return res.json({ token, userId: 'demo-1', email, fallback: true });
    }
});
/** GET /api/auth/me — returns the current user from the token. */
router.get('/me', (req, res) => {
    const header = req.headers.authorization;
    if (!header)
        return res.status(401).json({ error: 'No token' });
    try {
        const jwt = require('jsonwebtoken');
        const decoded = jwt.verify(header.split(' ')[1], process.env.JWT_SECRET || 'your_jwt_secret_key');
        return res.json(decoded);
    }
    catch {
        return res.status(401).json({ error: 'Invalid token' });
    }
});
exports.default = router;
