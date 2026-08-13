"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.purchaseAddon = purchaseAddon;
exports.listActiveAddons = listActiveAddons;
const client_1 = require("@prisma/client");
const ledger_1 = require("../lib/ledger");
const prisma = new client_1.PrismaClient();
async function purchaseAddon(userId, addonId) {
    const pricePence = 500; // placeholder
    try {
        await prisma.$connect();
        const purchase = await prisma.purchase.create({ data: { userId, type: 'ADDON', pricePence, meta: { addonId, recurring: true } } });
        (0, ledger_1.recordLedger)({ type: 'addon_purchase', userId, purchaseId: purchase.id, addonId });
        return { success: true, purchase };
    }
    catch (err) {
        return { success: false, reason: err.message };
    }
}
async function listActiveAddons(userId) {
    try {
        await prisma.$connect();
        const addons = await prisma.purchase.findMany({ where: { userId, type: 'ADDON' } });
        return addons;
    }
    catch (err) {
        return [];
    }
}
