"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createConversationHandler = createConversationHandler;
exports.getConversationHandler = getConversationHandler;
exports.markAsReadHandler = markAsReadHandler;
exports.postMessageHandler = postMessageHandler;
const messageService_1 = require("../services/messageService");
async function createConversationHandler(req, res) {
    const conv = await (0, messageService_1.createConversation)(req.body);
    return res.status(201).json(conv);
}
async function getConversationHandler(req, res) {
    const id = String(req.params.id || '');
    const rawUser = req.query.userId;
    const userId = rawUser ? (Array.isArray(rawUser) ? String(rawUser[0]) : String(rawUser)) : undefined;
    const limit = Number(String(req.query.limit || '50')) || 50;
    const resp = await (0, messageService_1.getConversation)(id, String(userId || ''));
    return res.json(resp);
}
async function markAsReadHandler(req, res) {
    const id = String(req.params.id || '');
    const userIdRaw = req.body.userId;
    const userId = Array.isArray(userIdRaw) ? String(userIdRaw[0]) : String(userIdRaw || '');
    const r = await (0, messageService_1.markAsRead)(id, userId);
    return res.json(r);
}
async function postMessageHandler(req, res) {
    const { id } = req.params;
    const raw = req.headers['idempotency-key'];
    const idempotencyKey = raw ? (Array.isArray(raw) ? raw[0] : raw) : undefined;
    const senderId = Array.isArray(req.body.senderId) ? String(req.body.senderId[0]) : String(req.body.senderId || '');
    const body = Array.isArray(req.body.body) ? String(req.body.body[0]) : String(req.body.body || '');
    const attachments = Array.isArray(req.body.attachments) ? req.body.attachments : req.body.attachments ? [req.body.attachments] : [];
    const msg = await (0, messageService_1.postMessage)({ conversationId: id, senderId, body, attachments, idempotencyKey });
    return res.status(201).json(msg);
}
