"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.initWS = initWS;
exports.emitToUser = emitToUser;
exports.emitToConversation = emitToConversation;
exports.onUserEvent = onUserEvent;
const socket_io_1 = require("socket.io");
const eventBus_1 = require("../lib/eventBus");
const auth_1 = require("../middleware/auth");
let io = null;
/** Call once from server.ts, passing the http.Server instance. */
function initWS(httpServer) {
    io = new socket_io_1.Server(httpServer, {
        cors: { origin: '*', methods: ['GET', 'POST'] },
        transports: ['websocket', 'polling'],
    });
    // ── WS auth middleware ──────────────────────────────────────────────────
    io.use((socket, next) => {
        const token = socket.handshake.auth?.token ||
            socket.handshake.headers?.authorization?.replace('Bearer ', '');
        if (!token) {
            console.warn(`[WS] unauthenticated connection from ${socket.id} — guest mode`);
            socket.data.user = undefined;
            return next();
        }
        const user = (0, auth_1.verifyToken)(token);
        if (!user) {
            return next(new Error('WS_AUTH_FAILED: invalid token'));
        }
        socket.data.user = user;
        console.log(`[WS] authenticated: ${socket.id} user=${user.id}`);
        next();
    });
    // ── Connection handler ──────────────────────────────────────────────────
    io.on('connection', (socket) => {
        const uid = socket.data.user?.id ?? 'guest';
        console.log(`[WS] connected: ${socket.id} (user=${uid})`);
        if (socket.data.user?.id) {
            socket.join(`user:${socket.data.user.id}`);
        }
        socket.on('join', ({ userId, conversationId }) => {
            const resolvedUserId = socket.data.user?.id ?? userId;
            if (resolvedUserId)
                socket.join(`user:${resolvedUserId}`);
            if (conversationId)
                socket.join(`conversation:${conversationId}`);
            console.log(`[WS] ${socket.id} joined user:${resolvedUserId ?? '-'} conv:${conversationId ?? '-'}`);
            socket.emit('join:ack', { userId: resolvedUserId, conversationId });
        });
        socket.on('leave', ({ conversationId }) => {
            if (conversationId)
                socket.leave(`conversation:${conversationId}`);
            console.log(`[WS] ${socket.id} left conv:${conversationId}`);
        });
        socket.on('disconnect', (reason) => {
            console.log(`[WS] disconnected: ${socket.id} (user=${uid}) reason=${reason}`);
        });
        socket.on('error', (err) => {
            console.error(`[WS] socket error ${socket.id}:`, err.message);
        });
    });
    // ── Domain event → room broadcast mappings ──────────────────────────────
    (0, eventBus_1.subscribe)('message.posted', ({ conversationId, messageId, senderId, body, createdAt }) => {
        emitToConversation(conversationId, 'message:new', {
            id: messageId, conversationId, senderId, body,
            createdAt: createdAt ?? new Date().toISOString(),
        });
        emitToConversation(conversationId, 'conversation:update', {
            conversationId, lastMessageBody: body,
            lastMessageAt: createdAt ?? new Date().toISOString(),
        });
    });
    (0, eventBus_1.subscribe)('message.read', ({ messageId, userId, conversationId }) => {
        emitToUser(userId, 'message:read', { messageId, conversationId });
        if (conversationId) {
            emitToConversation(conversationId, 'conversation:update', { conversationId, readBy: userId });
        }
    });
    (0, eventBus_1.subscribe)('message.updated', ({ messageId, conversationId, body }) => {
        emitToConversation(conversationId, 'message:update', { messageId, conversationId, body });
    });
    (0, eventBus_1.subscribe)('lead.unlocked', ({ userId, leadId, required, newBalance }) => {
        emitToUser(userId, 'lead:unlocked', { leadId, creditsUsed: required, newBalance });
        emitToUser(userId, 'credits:updated', { newBalance });
        if (newBalance !== undefined && newBalance < 10) {
            emitToUser(userId, 'credits:low', { balance: newBalance, threshold: 10 });
        }
    });
    (0, eventBus_1.subscribe)('lead.created', ({ leadId, lead }) => {
        io?.emit('lead:new', { leadId, lead });
    });
    (0, eventBus_1.subscribe)('lead.updated', ({ leadId, lead, userId }) => {
        if (userId)
            emitToUser(userId, 'lead:updated', { leadId, lead });
        else
            io?.emit('lead:updated', { leadId, lead });
    });
    (0, eventBus_1.subscribe)('lead.claimed', ({ leadId, claimedBy }) => {
        io?.emit('lead:claimed', { leadId, claimedBy });
    });
    (0, eventBus_1.subscribe)('purchase.created', ({ userId, purchaseId, newBalance, packCode }) => {
        emitToUser(userId, 'credits:purchase-complete', { purchaseId, packCode, newBalance });
        if (newBalance !== undefined) {
            emitToUser(userId, 'credits:updated', { newBalance });
        }
    });
    (0, eventBus_1.subscribe)('campaign.created', ({ userId, campaignId, campaign }) => {
        if (userId)
            emitToUser(userId, 'ads:new', { campaignId, campaign });
        io?.emit('ads:new', { campaignId, campaign });
    });
    (0, eventBus_1.subscribe)('campaign.updated', ({ userId, campaignId, campaign }) => {
        if (userId)
            emitToUser(userId, 'ads:updated', { campaignId, campaign });
        else
            io?.emit('ads:updated', { campaignId, campaign });
    });
    (0, eventBus_1.subscribe)('campaign.deleted', ({ userId, campaignId }) => {
        if (userId)
            emitToUser(userId, 'ads:deleted', { campaignId });
        else
            io?.emit('ads:deleted', { campaignId });
    });
    (0, eventBus_1.subscribe)('profile.updated', ({ userId, profile }) => {
        emitToUser(userId, 'profile:updated', { profile });
    });
    console.log('[WS] Socket.IO attached to HTTP server');
    return io;
}
function emitToUser(userId, event, payload) {
    io?.to(`user:${userId}`).emit(event, payload);
}
function emitToConversation(conversationId, event, payload) {
    io?.to(`conversation:${conversationId}`).emit(event, payload);
}
function onUserEvent(userId, event, handler) {
    io?.on('connection', (socket) => {
        socket.on(event, (p) => handler({ userId, ...p }));
    });
}
exports.default = { initWS, emitToUser, emitToConversation, onUserEvent };
