import { PrismaClient } from '@prisma/client';
import { recordLedger } from '../lib/ledger';
import { publish } from '../lib/eventBus';
import { getPackByCode, purchasePack } from './creditService';

const prisma = new PrismaClient();

export function creditsForJob(jobSize: number) {
  // simple linear mapping
  return Math.max(1, Math.ceil(jobSize / 10));
}

export async function unlockJob(userId: string, jobSize: number, options: any = {}) {
  const required = creditsForJob(jobSize);
  const idempotencyKey = options.idempotencyKey;

  try {
    await prisma.$connect();
    // start transaction
    const result = await prisma.$transaction(async (tx) => {
      const user = await tx.user.findUnique({ where: { id: userId } });
      if (!user) throw new Error('User not found');
      if (user.credits >= required) {
        // decrement
        const updated = await tx.user.update({ where: { id: userId }, data: { credits: user.credits - required } });
        const purchase = await tx.purchase.create({ data: { userId, type: 'LEAD_UNLOCK', credits: required, pricePence: 0, meta: { jobSize } } });
        const lead = await tx.$executeRaw`SELECT 1`; // placeholder for creating Lead
        recordLedger({ type: 'lead_unlocked', userId, required });
          publish('lead.unlocked', { userId, leadId: purchase.id, required, newBalance: updated.credits });
        return { success: true, required, newBalance: updated.credits };
      }

      // insufficient -> 402
      const packs = [getPackByCode('SMALL'), getPackByCode('GROWTH')].filter(Boolean);
      return { success: false, error: 'INSUFFICIENT_CREDITS', creditsNeeded: required - user.credits, suggestedPacks: packs };
    });

    return result;
  } catch (err) {
    return { success: false, reason: (err as Error).message };
  }
}
