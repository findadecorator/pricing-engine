import { PrismaClient } from '@prisma/client';
import { roundCurrency } from '../utils/math';
import { recordLedger } from '../lib/ledger';
import { publish } from '../lib/eventBus';

const prisma = new PrismaClient();
const inMemoryPacks = new Map<string, any>([
  ['SMALL', { code: 'SMALL', credits: 30, pricePence: 999 }],
  ['GROWTH', { code: 'GROWTH', credits: 100, pricePence: 2499 }],
]);

export function getPackByCode(code: string) {
  return inMemoryPacks.get(code.toUpperCase());
}

export async function purchasePack(userId: string, packCode: string, meta: any = {}) {
  const pack = getPackByCode(packCode);
  if (!pack) return { success: false, reason: 'PACK_NOT_FOUND' };
  try {
    await prisma.$connect();
    const res = await prisma.$transaction(async (tx) => {
      const user = await tx.user.findUnique({ where: { id: userId } });
      if (!user) throw new Error('User not found');
      const updated = await tx.user.update({ where: { id: userId }, data: { credits: user.credits + pack.credits } });
      const purchase = await tx.purchase.create({ data: { userId, type: 'PAYG_PACK', credits: pack.credits, pricePence: pack.pricePence, meta: { packCode, ...meta } } });
      recordLedger({ type: 'pack_purchase', userId, purchaseId: purchase.id, packCode });
      publish('purchase.created', { userId, purchaseId: purchase.id, packCode, newBalance: updated.credits });
      return { success: true, updated, purchase };
    });
    return res;
  } catch (err) {
    return { success: false, reason: (err as Error).message };
  }
}

export async function getUserCredits(userId: string): Promise<number> {
  try {
    await prisma.$connect();
    const user = await prisma.user.findUnique({ where: { id: userId } });
    return user?.credits ?? 0;
  } catch (err) {
    return 0;
  }
}

// Backwards-compatible helper used by seed scripts
export async function seedDemoUser(): Promise<{ id: string; email: string } | null> {
  try {
    await prisma.$connect();
    const u = await prisma.user.upsert({
      where: { email: 'demo@findadecorator.com' },
      create: { email: 'demo@findadecorator.com', credits: 100 },
      update: {} as any,
    });
    return { id: u.id, email: u.email };
  } catch (err) {
    // Fallback: return an in-memory stub
    return { id: 'demo-1', email: 'demo@findadecorator.com' };
  }
}

// Compatibility wrapper for controllers expecting buyCredits(userId, credits, packName)
export async function buyCredits(userId: string, credits: number, packName?: string) {
  // Try to resolve pack by name; if absent, pick SMALL
  const code = (packName || 'SMALL').toUpperCase();
  const pack = getPackByCode(code) || getPackByCode('SMALL');
  if (!pack) return { success: false, reason: 'NO_PACKS' };
  return purchasePack(userId, pack.code, { requestedCredits: credits });
}
