"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getPackByCode = getPackByCode;
exports.purchasePack = purchasePack;
exports.getUserCredits = getUserCredits;
exports.seedDemoUser = seedDemoUser;
exports.buyCredits = buyCredits;
const client_1 = require("@prisma/client");
const ledger_1 = require("../lib/ledger");
const eventBus_1 = require("../lib/eventBus");
const prisma = new client_1.PrismaClient();
const inMemoryPacks = new Map([
    ['SMALL', { code: 'SMALL', credits: 30, pricePence: 999 }],
    ['GROWTH', { code: 'GROWTH', credits: 100, pricePence: 2499 }],
]);
function getPackByCode(code) {
    return inMemoryPacks.get(code.toUpperCase());
}
async function purchasePack(userId, packCode, meta = {}) {
    const pack = getPackByCode(packCode);
    if (!pack)
        return { success: false, reason: 'PACK_NOT_FOUND' };
    try {
        await prisma.$connect();
        const res = await prisma.$transaction(async (tx) => {
            const user = await tx.user.findUnique({ where: { id: userId } });
            if (!user)
                throw new Error('User not found');
            const updated = await tx.user.update({ where: { id: userId }, data: { credits: user.credits + pack.credits } });
            const purchase = await tx.purchase.create({ data: { userId, type: 'PAYG_PACK', credits: pack.credits, pricePence: pack.pricePence, meta: { packCode, ...meta } } });
            (0, ledger_1.recordLedger)({ type: 'pack_purchase', userId, purchaseId: purchase.id, packCode });
            (0, eventBus_1.publish)('purchase.created', { userId, purchaseId: purchase.id, packCode, newBalance: updated.credits });
            return { success: true, updated, purchase };
        });
        return res;
    }
    catch (err) {
        return { success: false, reason: err.message };
    }
}
async function getUserCredits(userId) {
    try {
        await prisma.$connect();
        const user = await prisma.user.findUnique({ where: { id: userId } });
        return user?.credits ?? 0;
    }
    catch (err) {
        return 0;
    }
}
// Backwards-compatible helper used by seed scripts
async function seedDemoUser() {
    try {
        await prisma.$connect();
        const u = await prisma.user.upsert({
            where: { email: 'demo@findadecorator.com' },
            create: { email: 'demo@findadecorator.com', credits: 100 },
            update: {},
        });
        return { id: u.id, email: u.email };
    }
    catch (err) {
        // Fallback: return an in-memory stub
        return { id: 'demo-1', email: 'demo@findadecorator.com' };
    }
}
// Compatibility wrapper for controllers expecting buyCredits(userId, credits, packName)
async function buyCredits(userId, credits, packName) {
    // Try to resolve pack by name; if absent, pick SMALL
    const code = (packName || 'SMALL').toUpperCase();
    const pack = getPackByCode(code) || getPackByCode('SMALL');
    if (!pack)
        return { success: false, reason: 'NO_PACKS' };
    return purchasePack(userId, pack.code, { requestedCredits: credits });
}
