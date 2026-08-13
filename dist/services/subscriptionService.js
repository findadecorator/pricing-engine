"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.applySubscription = applySubscription;
exports.cancelSubscription = cancelSubscription;
exports.renewSubscription = renewSubscription;
exports.handleStripeWebhook = handleStripeWebhook;
const client_1 = require("@prisma/client");
const ledger_1 = require("../lib/ledger");
const prisma = new client_1.PrismaClient();
const SUBSCRIPTION_CREDITS = {
    PLATINUM: 1000,
    PREMIUM: 500,
    GROWTH: 200,
    PRO: 50,
    STARTER: 10,
};
async function applySubscription(userId, plan, metadata = {}) {
    const credits = SUBSCRIPTION_CREDITS[plan.toUpperCase()] ?? 0;
    try {
        await prisma.$connect();
        const user = await prisma.user.update({ where: { id: userId }, data: { credits, }, });
        const purchase = await prisma.purchase.create({ data: { userId, type: 'SUBSCRIPTION', credits, pricePence: metadata.pricePence ?? 0, meta: metadata } });
        (0, ledger_1.recordLedger)({ type: 'subscription_applied', userId, plan, purchaseId: purchase.id });
        return { success: true, user, purchase };
    }
    catch (err) {
        return { success: false, reason: err.message };
    }
}
async function cancelSubscription(userId) {
    try {
        await prisma.$connect();
        // set a subscriptionCancelledAt in meta via purchase
        const user = await prisma.user.update({ where: { id: userId }, data: { /* remove plan */}, });
        (0, ledger_1.recordLedger)({ type: 'subscription_cancelled', userId });
        return { success: true };
    }
    catch (err) {
        return { success: false, reason: err.message };
    }
}
async function renewSubscription(userId, plan, metadata = {}) {
    // Simplified: top up credits and create Purchase
    const credits = SUBSCRIPTION_CREDITS[plan.toUpperCase()] ?? 0;
    try {
        await prisma.$connect();
        const purchase = await prisma.purchase.create({ data: { userId, type: 'SUBSCRIPTION_RENEWAL', credits, pricePence: metadata.pricePence ?? 0, meta: metadata } });
        await prisma.user.update({ where: { id: userId }, data: { credits } });
        (0, ledger_1.recordLedger)({ type: 'subscription_renewed', userId, purchaseId: purchase.id });
        return { success: true, purchase };
    }
    catch (err) {
        return { success: false, reason: err.message };
    }
}
function handleStripeWebhook(_event) {
    // skeleton
    return { handled: true };
}
