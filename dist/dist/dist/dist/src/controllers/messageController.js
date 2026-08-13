"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createConversationHandler = createConversationHandler;
exports.getConversationHandler = getConversationHandler;
exports.markAsReadHandler = markAsReadHandler;
exports.postMessageHandler = postMessageHandler;
exports.getUnreadCountHandler = getUnreadCountHandler;
const messageService_1 = require("../services/messageService");
async function createConversationHandler(req, res) {
    const conv = await (0, messageService_1.createConversation)(req.body);
    return res.status(201).json(conv);
}
async function getConversationHandler(req, res) {
    const id = String(req.params.id || '');
    const rawUser = req.query.userId;
    const userId = rawUser ? (Array.isArray(rawUser) ? String(rawUser[0]) : String(rawUser)) : undefined;
    const resp = await (0, messageService_1.getConversation)(id, String(userId || req.user?.id || ''));
    return res.json(resp);
}
async function markAsReadHandler(req, res) {
    const id = String(req.params.id || '');
    const userId = req.user?.id ?? String(req.body.userId || '');
    const r = await (0, messageService_1.markAsRead)(id, userId);
    return res.json(r);
}
async function postMessageHandler(req, res) {
    const { id } = req.params;
    const raw = req.headers['idempotency-key'];
    const idempotencyKey = raw ? (Array.isArray(raw) ? raw[0] : raw) : undefined;
    // Use authenticated user id if available; fall back to body senderId
    const senderId = req.user?.id ?? (Array.isArray(req.body.senderId) ? String(req.body.senderId[0]) : String(req.body.senderId || ''));
    const body = Array.isArray(req.body.body) ? String(req.body.body[0]) : String(req.body.body || '');
    const attachments = Array.isArray(req.body.attachments) ? req.body.attachments : req.body.attachments ? [req.body.attachments] : [];
    const msg = await (0, messageService_1.postMessage)({ conversationId: id, senderId, body, attachments, idempotencyKey });
    return res.status(201).json(msg);
}
async function getUnreadCountHandler(req, res) {
    const userId = req.user?.id ?? String(req.query.userId || '');
    const count = await (0, messageService_1.getUnreadCount)(userId);
    return res.json({ userId, unread: count });
}
