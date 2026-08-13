import { PrismaClient } from "@prisma/client";
import { publish } from "../lib/eventBus";
import { recordLedger } from "../lib/ledger";

const prisma = new PrismaClient();

export async function createConversation({ jobId, title, participants, createdBy }: any) {
  try {
    await prisma.$connect();
    const conv = await prisma.conversation.create({
      data: { jobId, title, createdBy, participants: JSON.stringify(participants ?? []) },
    });
    return conv;
  } catch (err) {
    return { error: (err as Error).message };
  }
}

/** List all conversations that the userId appears in. */
export async function getConversations(userId: string) {
  try {
    await prisma.$connect();
    const all = await prisma.conversation.findMany({
      where: { participants: { contains: userId } },
      orderBy: { updatedAt: "desc" },
      take: 100,
    });
    // Attach last message preview
    const enriched = await Promise.all(
      all.map(async (c) => {
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
          participants: (() => { try { return JSON.parse(c.participants as string); } catch { return []; } })(),
          lastMessageBody: last?.body ?? null,
          lastMessageAt: last?.createdAt?.toISOString() ?? null,
          unread: unreadCount > 0,
          unreadCount,
        };
      })
    );
    return enriched;
  } catch (err) {
    return [];
  }
}

export async function postMessage({ conversationId, senderId, body, attachments = [], idempotencyKey }: any) {
  try {
    await prisma.$connect();
    if (idempotencyKey) {
      const existing = await prisma.message.findUnique({ where: { idempotencyKey } });
      if (existing) return existing;
    }
    const msg = await prisma.message.create({
      data: { conversationId, senderId, body, metadata: { attachments }, idempotencyKey },
    });
    await prisma.conversation.update({ where: { id: conversationId }, data: { updatedAt: new Date() } });
    publish("message.posted", {
      conversationId,
      messageId: msg.id,
      senderId,
      body,
      createdAt: msg.createdAt?.toISOString(),
    });
    return msg;
  } catch (err) {
    return { error: (err as Error).message };
  }
}

export async function getConversation(conversationId: string, _userId: string, opts: any = {}) {
  try {
    await prisma.$connect();
    const messages = await prisma.message.findMany({
      where: { conversationId },
      take: opts.limit ?? 50,
      orderBy: { createdAt: "asc" },
    });
    return { messages };
  } catch (err) {
    return { error: (err as Error).message };
  }
}

export async function getUnreadCount(userId: string): Promise<number> {
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
  } catch {
    return 0;
  }
}

export async function markAsRead(messageId: string, userId: string) {
  try {
    await prisma.$connect();
    const msg = await prisma.message.update({
      where: { id: messageId },
      data: { status: "READ" },
    });
    publish("message.read", { messageId, userId, conversationId: msg.conversationId });
    return { success: true };
  } catch (err) {
    return { success: false, reason: (err as Error).message };
  }
}
