"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.creditsForJob = creditsForJob;
exports.unlockJob = unlockJob;
const client_1 = require("@prisma/client");
const ledger_1 = require("../lib/ledger");
const eventBus_1 = require("../lib/eventBus");
const creditService_1 = require("./creditService");
const prisma = new client_1.PrismaClient();
function creditsForJob(jobSize) {
    // simple linear mapping
    return Math.max(1, Math.ceil(jobSize / 10));
}
async function unlockJob(userId, jobSize, options = {}) {
    const required = creditsForJob(jobSize);
    const idempotencyKey = options.idempotencyKey;
    try {
        await prisma.$connect();
        // start transaction
        const result = await prisma.$transaction(async (tx) => {
            const user = await tx.user.findUnique({ where: { id: userId } });
            if (!user)
                throw new Error('User not found');
            if (user.credits >= required) {
                // decrement
                const updated = await tx.user.update({ where: { id: userId }, data: { credits: user.credits - required } });
                const purchase = await tx.purchase.create({ data: { userId, type: 'LEAD_UNLOCK', credits: required, pricePence: 0, meta: { jobSize } } });
                const lead = await tx.$executeRaw `SELECT 1`; // placeholder for creating Lead
                (0, ledger_1.recordLedger)({ type: 'lead_unlocked', userId, required });
                (0, eventBus_1.publish)('lead.unlocked', { userId, leadId: purchase.id, required, newBalance: updated.credits });
                return { success: true, required, newBalance: updated.credits };
            }
            // insufficient -> 402
            const packs = [(0, creditService_1.getPackByCode)('SMALL'), (0, creditService_1.getPackByCode)('GROWTH')].filter(Boolean);
            return { success: false, error: 'INSUFFICIENT_CREDITS', creditsNeeded: required - user.credits, suggestedPacks: packs };
        });
        return result;
    }
    catch (err) {
        return { success: false, reason: err.message };
    }
}
