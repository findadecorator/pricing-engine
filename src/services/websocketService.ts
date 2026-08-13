import { Server as SocketIOServer, Socket } from 'socket.io';
import { IncomingMessage, ServerResponse } from 'http';
import * as http from 'http';
import { subscribe } from '../lib/eventBus';
import { verifyToken, AuthenticatedUser } from '../middleware/auth';

// Extend Socket to carry the authenticated user — use socket.io's SocketData interface
declare module 'socket.io' {
  interface SocketData {
    user?: AuthenticatedUser;
  }
}

let io: SocketIOServer | null = null;

/** Call once from server.ts, passing the http.Server instance. */
export function initWS(
  httpServer: http.Server<typeof IncomingMessage, typeof ServerResponse>
): SocketIOServer {
  io = new SocketIOServer(httpServer, {
    cors: { origin: '*', methods: ['GET', 'POST'] },
    transports: ['websocket', 'polling'],
  });

  // ── WS auth middleware ──────────────────────────────────────────────────
  io.use((socket: Socket, next) => {
    const token =
      (socket.handshake.auth as any)?.token ||
      socket.handshake.headers?.authorization?.replace('Bearer ', '');

    if (!token) {
      console.warn(`[WS] unauthenticated connection from ${socket.id} — guest mode`);
      socket.data.user = undefined;
      return next();
    }

    const user = verifyToken(token);
    if (!user) {
      return next(new Error('WS_AUTH_FAILED: invalid token'));
    }
    socket.data.user = user;
    console.log(`[WS] authenticated: ${socket.id} user=${user.id}`);
    next();
  });

  // ── Connection handler ──────────────────────────────────────────────────
  io.on('connection', (socket: Socket) => {
    const uid = socket.data.user?.id ?? 'guest';
    console.log(`[WS] connected: ${socket.id} (user=${uid})`);

    if (socket.data.user?.id) {
      socket.join(`user:${socket.data.user.id}`);
    }

    socket.on('join', ({ userId, conversationId }: any) => {
      const resolvedUserId = socket.data.user?.id ?? userId;
      if (resolvedUserId) socket.join(`user:${resolvedUserId}`);
      if (conversationId) socket.join(`conversation:${conversationId}`);
      console.log(`[WS] ${socket.id} joined user:${resolvedUserId ?? '-'} conv:${conversationId ?? '-'}`);
      socket.emit('join:ack', { userId: resolvedUserId, conversationId });
    });

    socket.on('leave', ({ conversationId }: any) => {
      if (conversationId) socket.leave(`conversation:${conversationId}`);
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

  subscribe('message.posted', ({ conversationId, messageId, senderId, body, createdAt }: any) => {
    emitToConversation(conversationId, 'message:new', {
      id: messageId, conversationId, senderId, body,
      createdAt: createdAt ?? new Date().toISOString(),
    });
    emitToConversation(conversationId, 'conversation:update', {
      conversationId, lastMessageBody: body,
      lastMessageAt: createdAt ?? new Date().toISOString(),
    });
  });

  subscribe('message.read', ({ messageId, userId, conversationId }: any) => {
    emitToUser(userId, 'message:read', { messageId, conversationId });
    if (conversationId) {
      emitToConversation(conversationId, 'conversation:update', { conversationId, readBy: userId });
    }
  });

  subscribe('message.updated', ({ messageId, conversationId, body }: any) => {
    emitToConversation(conversationId, 'message:update', { messageId, conversationId, body });
  });

  subscribe('lead.unlocked', ({ userId, leadId, required, newBalance }: any) => {
    emitToUser(userId, 'lead:unlocked', { leadId, creditsUsed: required, newBalance });
    emitToUser(userId, 'credits:updated', { newBalance });
    if (newBalance !== undefined && newBalance < 10) {
      emitToUser(userId, 'credits:low', { balance: newBalance, threshold: 10 });
    }
  });

  subscribe('lead.created', ({ leadId, lead }: any) => {
    io?.emit('lead:new', { leadId, lead });
  });

  subscribe('lead.updated', ({ leadId, lead, userId }: any) => {
    if (userId) emitToUser(userId, 'lead:updated', { leadId, lead });
    else io?.emit('lead:updated', { leadId, lead });
  });

  subscribe('lead.claimed', ({ leadId, claimedBy }: any) => {
    io?.emit('lead:claimed', { leadId, claimedBy });
  });

  subscribe('purchase.created', ({ userId, purchaseId, newBalance, packCode }: any) => {
    emitToUser(userId, 'credits:purchase-complete', { purchaseId, packCode, newBalance });
    if (newBalance !== undefined) {
      emitToUser(userId, 'credits:updated', { newBalance });
    }
  });

  subscribe('campaign.created', ({ userId, campaignId, campaign }: any) => {
    if (userId) emitToUser(userId, 'ads:new', { campaignId, campaign });
    io?.emit('ads:new', { campaignId, campaign });
  });

  subscribe('campaign.updated', ({ userId, campaignId, campaign }: any) => {
    if (userId) emitToUser(userId, 'ads:updated', { campaignId, campaign });
    else io?.emit('ads:updated', { campaignId, campaign });
  });

  subscribe('campaign.deleted', ({ userId, campaignId }: any) => {
    if (userId) emitToUser(userId, 'ads:deleted', { campaignId });
    else io?.emit('ads:deleted', { campaignId });
  });

  subscribe('profile.updated', ({ userId, profile }: any) => {
    emitToUser(userId, 'profile:updated', { profile });
  });

  console.log('[WS] Socket.IO attached to HTTP server');
  return io;
}

export function emitToUser(userId: string, event: string, payload: any): void {
  io?.to(`user:${userId}`).emit(event, payload);
}

export function emitToConversation(conversationId: string, event: string, payload: any): void {
  io?.to(`conversation:${conversationId}`).emit(event, payload);
}

export function onUserEvent(userId: string, event: string, handler: (p: any) => void): void {
  io?.on('connection', (socket: Socket) => {
    socket.on(event, (p) => handler({ userId, ...p }));
  });
}

export default { initWS, emitToUser, emitToConversation, onUserEvent };
