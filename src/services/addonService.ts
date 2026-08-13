import { PrismaClient } from '@prisma/client';
import { recordLedger } from '../lib/ledger';

const prisma = new PrismaClient();

export async function purchaseAddon(userId: string, addonId: string) {
  const pricePence = 500; // placeholder
  try {
    await prisma.$connect();
    const purchase = await prisma.purchase.create({ data: { userId, type: 'ADDON', pricePence, meta: { addonId, recurring: true } } });
    recordLedger({ type: 'addon_purchase', userId, purchaseId: purchase.id, addonId });
    return { success: true, purchase };
  } catch (err) {
    return { success: false, reason: (err as Error).message };
  }
}

export async function listActiveAddons(userId: string) {
  try {
    await prisma.$connect();
    const addons = await prisma.purchase.findMany({ where: { userId, type: 'ADDON' } });
    return addons;
  } catch (err) {
    return [];
  }
}
