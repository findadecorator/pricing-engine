"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createCoupon = createCoupon;
exports.validateCoupon = validateCoupon;
exports.applyCouponToPurchase = applyCouponToPurchase;
const client_1 = require("@prisma/client");
const prisma = new client_1.PrismaClient();
async function createCoupon(data) {
    await prisma.$connect();
    return prisma.coupon.create({ data });
}
async function validateCoupon(code) {
    await prisma.$connect();
    const c = await prisma.coupon.findUnique({ where: { code } });
    if (!c || !c.active)
        return { valid: false };
    return { valid: true, coupon: c };
}
async function applyCouponToPurchase(purchaseId, code) {
    // skeleton: mark purchase meta
    await prisma.$connect();
    const coupon = await prisma.coupon.findUnique({ where: { code } });
    if (!coupon)
        return { success: false };
    await prisma.purchase.update({ where: { id: purchaseId }, data: { meta: { appliedCoupon: code } } });
    return { success: true };
}
