"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.unlockJobHandler = unlockJobHandler;
const leadService_1 = require("../services/leadService");
async function unlockJobHandler(req, res) {
    const { userId, jobSize } = req.body;
    const raw = req.headers['idempotency-key'];
    const idempotencyKey = raw ? (Array.isArray(raw) ? raw[0] : raw) : undefined;
    const result = await (0, leadService_1.unlockJob)(userId, Number(jobSize), { idempotencyKey });
    if (result && 'error' in result && result.error === 'INSUFFICIENT_CREDITS') {
        return res.status(402).json(result);
    }
    return res.json(result);
}
