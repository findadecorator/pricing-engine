"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.buyExclusiveLead = buyExclusiveLead;
const client_1 = require("@prisma/client");
const ledger_1 = require("../lib/ledger");
const eventBus_1 = require("../lib/eventBus");
const prisma = new client_1.PrismaClient();
async function buyExclusiveLead(userId, jobSize) {
    const pricePence = Math.max(1000, jobSize * 100); // placeholder
    try {
        await prisma.$connect();
        const purchase = await prisma.purchase.create({ data: { userId, type: 'EXCLUSIVE_LEAD', pricePence, meta: { jobSize } } });
        // Create ExclusiveLead and Lead (simplified)
        // For now, just record ledger and publish
        (0, ledger_1.recordLedger)({ type: 'exclusive_purchase', userId, purchaseId: purchase.id, pricePence });
        (0, eventBus_1.publish)('lead.exclusive_created', { userId, pricePence });
        return { success: true, purchase };
    }
    catch (err) {
        return { success: false, reason: err.message };
    }
}
