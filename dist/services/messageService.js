"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createConversation = createConversation;
exports.getConversations = getConversations;
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
        const conv = await prisma.conversation.create({
            data: { jobId, title, createdBy, participants: JSON.stringify(participants ?? []) },
        });
        return conv;
    }
    catch (err) {
        return { error: err.message };
    }
}
/** List all conversations that the userId appears in. */
async function getConversations(userId) {
    try {
        await prisma.$connect();
        const all = await prisma.conversation.findMany({
            where: { participants: { contains: userId } },
            orderBy: { updatedAt: "desc" },
            take: 100,
        });
        // Attach last message preview
        const enriched = await Promise.all(all.map(async (c) => {
            const last = await prisma.message.findFirst({
                where: { conversationId: c.id },
                orderBy: { createdAt: "desc" },
                select: { body: true, createdAt: true, senderId: true, status: true },
            });
            const unreadCount = await prisma.message.count({
                where: { conversationId: c.id, status: { not: "READ" }, senderId: { not: userId } },
            });
            return {
                ...c,
                participants: (() => { try {
                    return JSON.parse(c.participants);
                }
                catch {
                    return [];
                } })(),
                lastMessageBody: last?.body ?? null,
                lastMessageAt: last?.createdAt?.toISOString() ?? null,
                unread: unreadCount > 0,
                unreadCount,
            };
        }));
        return enriched;
    }
    catch (err) {
        return [];
    }
}
async function postMessage({ conversationId, senderId, body, attachments = [], idempotencyKey }) {
    try {
        await prisma.$connect();
        if (idempotencyKey) {
            const existing = await prisma.message.findUnique({ where: { idempotencyKey } });
            if (existing)
                return existing;
        }
        const msg = await prisma.message.create({
            data: { conversationId, senderId, body, metadata: { attachments }, idempotencyKey },
        });
        await prisma.conversation.update({ where: { id: conversationId }, data: { updatedAt: new Date() } });
        (0, eventBus_1.publish)("message.posted", {
            conversationId,
            messageId: msg.id,
            senderId,
            body,
            createdAt: msg.createdAt?.toISOString(),
        });
        return msg;
    }
    catch (err) {
        return { error: err.message };
    }
}
async function getConversation(conversationId, _userId, opts = {}) {
    try {
        await prisma.$connect();
        const messages = await prisma.message.findMany({
            where: { conversationId },
            take: opts.limit ?? 50,
            orderBy: { createdAt: "asc" },
        });
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
            where: {
                status: { not: "READ" },
                senderId: { not: userId },
                conversation: { participants: { contains: userId } },
            },
        });
        return count;
    }
    catch {
        return 0;
    }
}
async function markAsRead(messageId, userId) {
    try {
        await prisma.$connect();
        const msg = await prisma.message.update({
            where: { id: messageId },
            data: { status: "READ" },
        });
        (0, eventBus_1.publish)("message.read", { messageId, userId, conversationId: msg.conversationId });
        return { success: true };
    }
    catch (err) {
        return { success: false, reason: err.message };
    }
}
