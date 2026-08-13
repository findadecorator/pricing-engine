"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.enqueueNotification = enqueueNotification;
exports.deliverNotification = deliverNotification;
const client_1 = require("@prisma/client");
const eventBus_1 = require("../lib/eventBus");
const prisma = new client_1.PrismaClient();
async function enqueueNotification({ userId, type, payload }) {
    try {
        await prisma.$connect();
        const n = await prisma.notification.create({ data: { userId, type, payload } });
        (0, eventBus_1.publish)('notification.enqueued', { id: n.id, userId });
        return n;
    }
    catch (err) {
        return { error: err.message };
    }
}
async function deliverNotification(notificationId) {
    // skeleton
    try {
        await prisma.$connect();
        await prisma.notification.update({ where: { id: notificationId }, data: { delivered: true } });
        return { success: true };
    }
    catch (err) {
        return { success: false, reason: err.message };
    }
}
