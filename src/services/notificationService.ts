import { PrismaClient } from '@prisma/client';
import { publish } from '../lib/eventBus';

const prisma = new PrismaClient();

export async function enqueueNotification({ userId, type, payload }: any) {
  try {
    await prisma.$connect();
    const n = await prisma.notification.create({ data: { userId, type, payload } });
    publish('notification.enqueued', { id: n.id, userId });
    return n;
  } catch (err) {
    return { error: (err as Error).message };
  }
}

export async function deliverNotification(notificationId: string) {
  // skeleton
  try {
    await prisma.$connect();
    await prisma.notification.update({ where: { id: notificationId }, data: { delivered: true } });
    return { success: true };
  } catch (err) {
    return { success: false, reason: (err as Error).message };
  }
}
