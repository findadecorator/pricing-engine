"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createConversation = createConversation;
exports.postMessage = postMessage;
exports.getConversation = getConversation;
exports.getUnreadCount = getUnreadCount;
exports.markAsRead = markAsRead;
const client_1 = require("@prisma/client");
const eventBus_1 = require("../lib/eventBus");
const prisma = new client_1.PrismaClient();
async function createConversation({ jobId, title, participants, createdBy }) {
    try {
        await prisma.$connect();
        const conv = await prisma.conversation.create({ data: { jobId, title, createdBy, participants: JSON.stringify(participants) } });
        return conv;
    }
    catch (err) {
        return { error: err.message };
    }
}
async function postMessage({ conversationId, senderId, body, attachments = [], idempotencyKey }) {
    try {
        await prisma.$connect();
        // idempotency: if exists, return
        if (idempotencyKey) {
            const existing = await prisma.message.findUnique({ where: { idempotencyKey } });
            if (existing)
                return existing;
        }
        const msg = await prisma.message.create({ data: { conversationId, senderId, body, metadata: { attachments }, idempotencyKey } });
        await prisma.conversation.update({ where: { id: conversationId }, data: { updatedAt: new Date() } });
        (0, eventBus_1.publish)('message.posted', { conversationId, messageId: msg.id, senderId, body, createdAt: msg.createdAt?.toISOString() });
        return msg;
    }
    catch (err) {
        return { error: err.message };
    }
}
async function getConversation(conversationId, _userId, opts = {}) {
    try {
        await prisma.$connect();
        const messages = await prisma.message.findMany({ where: { conversationId }, take: opts.limit ?? 50, orderBy: { createdAt: 'desc' } });
        return { messages };
    }
    catch (err) {
        return { error: err.message };
    }
}
async function getUnreadCount(userId) {
    try {
        await prisma.$connect();
        const count = await prisma.message.count({
            where: { status: { not: 'READ' }, conversation: { participants: { contains: userId } } },
        });
        return count;
    }
    catch {
        return 0;
    }
}
async function markAsRead(messageId, userId) {
    // simplified: create Notification or update status
    try {
        await prisma.$connect();
        await prisma.message.update({ where: { id: messageId }, data: { status: 'READ' } });
        (0, eventBus_1.publish)('message.read', { messageId, userId, conversationId: undefined });
        return { success: true };
    }
    catch (err) {
        return { success: false, reason: err.message };
    }
}
