import { PrismaClient } from '@prisma/client';
import { recordLedger } from '../lib/ledger';
import { publish } from '../lib/eventBus';

const prisma = new PrismaClient();

export async function buyExclusiveLead(userId: string, jobSize: number) {
  const pricePence = Math.max(1000, jobSize * 100); // placeholder
  try {
    await prisma.$connect();
    const purchase = await prisma.purchase.create({ data: { userId, type: 'EXCLUSIVE_LEAD', pricePence, meta: { jobSize } } });
    // Create ExclusiveLead and Lead (simplified)
    // For now, just record ledger and publish
    recordLedger({ type: 'exclusive_purchase', userId, purchaseId: purchase.id, pricePence });
    publish('lead.exclusive_created', { userId, pricePence });
    return { success: true, purchase };
  } catch (err) {
    return { success: false, reason: (err as Error).message };
  }
}
