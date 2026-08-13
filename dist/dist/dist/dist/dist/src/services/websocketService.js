"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.initWS = initWS;
exports.emitToUser = emitToUser;
exports.emitToConversation = emitToConversation;
exports.onUserEvent = onUserEvent;
const socket_io_1 = require("socket.io");
const eventBus_1 = require("../lib/eventBus");
let io = null;
/** Call once from server.ts, passing the http.Server instance. */
function initWS(httpServer) {
    io = new socket_io_1.Server(httpServer, {
        cors: { origin: '*', methods: ['GET', 'POST'] },
        transports: ['websocket', 'polling'],
    });
    io.on('connection', (socket) => {
        console.log(`[WS] client connected: ${socket.id}`);
        // client sends { userId } to join their personal room
        socket.on('join', ({ userId, conversationId }) => {
            if (userId)
                socket.join(`user:${userId}`);
            if (conversationId)
                socket.join(`conversation:${conversationId}`);
            console.log(`[WS] ${socket.id} joined user:${userId ?? '-'} conversation:${conversationId ?? '-'}`);
        });
        socket.on('disconnect', () => {
            console.log(`[WS] client disconnected: ${socket.id}`);
        });
    });
    // bridge domain events → socket rooms
    (0, eventBus_1.subscribe)('message.posted', ({ conversationId, messageId, senderId, body, createdAt }) => {
        emitToConversation(conversationId, 'message:new', {
            id: messageId, conversationId, senderId, body, createdAt,
        });
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
