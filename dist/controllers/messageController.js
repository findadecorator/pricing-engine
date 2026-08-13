"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createConversationHandler = createConversationHandler;
exports.listConversationsHandler = listConversationsHandler;
exports.getConversationHandler = getConversationHandler;
exports.postMessageHandler = postMessageHandler;
exports.markAsReadHandler = markAsReadHandler;
exports.getUnreadCountHandler = getUnreadCountHandler;
const messageService_1 = require("../services/messageService");
async function createConversationHandler(req, res) {
    const createdBy = req.user?.id ?? req.body.createdBy;
    const conv = await (0, messageService_1.createConversation)({ ...req.body, createdBy });
    return res.status(201).json(conv);
}
async function listConversationsHandler(req, res) {
    const userId = req.user?.id ?? String(req.query.userId ?? "");
    const conversations = await (0, messageService_1.getConversations)(userId);
    return res.json(conversations);
}
async function getConversationHandler(req, res) {
    const id = String(req.params.id ?? "");
    const userId = req.user?.id ?? String(req.query.userId ?? "");
    const resp = await (0, messageService_1.getConversation)(id, userId);
    return res.json(resp);
}
async function postMessageHandler(req, res) {
    const { id } = req.params;
    const raw = req.headers["idempotency-key"];
    const idempotencyKey = raw ? (Array.isArray(raw) ? raw[0] : raw) : undefined;
    const senderId = req.user?.id ?? String(req.body.senderId ?? "");
    const body = String(req.body.body ?? "");
    const attachments = Array.isArray(req.body.attachments) ? req.body.attachments : req.body.attachments ? [req.body.attachments] : [];
    const msg = await (0, messageService_1.postMessage)({ conversationId: id, senderId, body, attachments, idempotencyKey });
    return res.status(201).json(msg);
}
async function markAsReadHandler(req, res) {
    const id = String(req.params.id ?? "");
    const userId = req.user?.id ?? String(req.body.userId ?? "");
    const r = await (0, messageService_1.markAsRead)(id, userId);
    return res.json(r);
}
async function getUnreadCountHandler(req, res) {
    const userId = req.user?.id ?? String(req.query.userId ?? "");
    const count = await (0, messageService_1.getUnreadCount)(userId);
    return res.json({ userId, unread: count });
}
