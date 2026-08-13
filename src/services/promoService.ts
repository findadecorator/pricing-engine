import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function createCoupon(data: any) {
  await prisma.$connect();
  return prisma.coupon.create({ data });
}

export async function validateCoupon(code: string) {
  await prisma.$connect();
  const c = await prisma.coupon.findUnique({ where: { code } });
  if (!c || !c.active) return { valid: false };
  return { valid: true, coupon: c };
}

export async function applyCouponToPurchase(purchaseId: string, code: string) {
  // skeleton: mark purchase meta
  await prisma.$connect();
  const coupon = await prisma.coupon.findUnique({ where: { code } });
  if (!coupon) return { success: false };
  await prisma.purchase.update({ where: { id: purchaseId }, data: { meta: { appliedCoupon: code } } });
  return { success: true };
}
