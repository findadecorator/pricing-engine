"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getIdempotentResult = getIdempotentResult;
exports.setIdempotentResult = setIdempotentResult;
exports.idempotencyMiddleware = idempotencyMiddleware;
// Simple idempotency store with in-memory fallback
const store = new Map();
async function getIdempotentResult(key) {
    return store.get(key);
}
async function setIdempotentResult(key, value, ttlSeconds = 3600) {
    store.set(key, value);
    setTimeout(() => store.delete(key), ttlSeconds * 1000);
}
function idempotencyMiddleware(req, res, next) {
    const key = req.headers['idempotency-key'] || req.headers['Idempotency-Key'];
    if (!key)
        return next();
    const existing = store.get(key);
    if (existing) {
        res.setHeader('Idempotency-Key', key);
        return res.json(existing);
    }
    // attach a finish handler to persist response
    const originalJson = res.json.bind(res);
    res.json = (body) => {
        store.set(key, body);
        setTimeout(() => store.delete(key), 3600 * 1000);
        return originalJson(body);
    };
    next();
}
