import { PrismaClient } from '@prisma/client';
import { recordLedger } from '../lib/ledger';

const prisma = new PrismaClient();

const SUBSCRIPTION_CREDITS: Record<string, number> = {
  PLATINUM: 1000,
  PREMIUM: 500,
  GROWTH: 200,
  PRO: 50,
  STARTER: 10,
};

export async function applySubscription(userId: string, plan: string, metadata: any = {}) {
  const credits = SUBSCRIPTION_CREDITS[plan.toUpperCase()] ?? 0;
  try {
    await prisma.$connect();
    const user = await prisma.user.update({ where: { id: userId }, data: { credits, }, });
    const purchase = await prisma.purchase.create({ data: { userId, type: 'SUBSCRIPTION', credits, pricePence: metadata.pricePence ?? 0, meta: metadata } });
    recordLedger({ type: 'subscription_applied', userId, plan, purchaseId: purchase.id });
    return { success: true, user, purchase };
  } catch (err) {
    return { success: false, reason: (err as Error).message };
  }
}

export async function cancelSubscription(userId: string) {
  try {
    await prisma.$connect();
    // set a subscriptionCancelledAt in meta via purchase
    const user = await prisma.user.update({ where: { id: userId }, data: { /* remove plan */ }, });
    recordLedger({ type: 'subscription_cancelled', userId });
    return { success: true };
  } catch (err) {
    return { success: false, reason: (err as Error).message };
  }
}

export async function renewSubscription(userId: string, plan: string, metadata: any = {}) {
  // Simplified: top up credits and create Purchase
  const credits = SUBSCRIPTION_CREDITS[plan.toUpperCase()] ?? 0;
  try {
    await prisma.$connect();
    const purchase = await prisma.purchase.create({ data: { userId, type: 'SUBSCRIPTION_RENEWAL', credits, pricePence: metadata.pricePence ?? 0, meta: metadata } });
    await prisma.user.update({ where: { id: userId }, data: { credits } });
    recordLedger({ type: 'subscription_renewed', userId, purchaseId: purchase.id });
    return { success: true, purchase };
  } catch (err) {
    return { success: false, reason: (err as Error).message };
  }
}

export function handleStripeWebhook(_event: any) {
  // skeleton
  return { handled: true };
}
