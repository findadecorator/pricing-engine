"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createCampaign = createCampaign;
exports.recordImpression = recordImpression;
exports.recordClick = recordClick;
const client_1 = require("@prisma/client");
const ledger_1 = require("../lib/ledger");
const eventBus_1 = require("../lib/eventBus");
const prisma = new client_1.PrismaClient();
async function createCampaign(data) {
    try {
        await prisma.$connect();
        const c = await prisma.campaign.create({ data });
        (0, ledger_1.recordLedger)({ type: 'campaign.created', campaignId: c.id });
        return c;
    }
    catch (err) {
        return { error: err.message };
    }
}
async function recordImpression(campaignId, userId, meta) {
    try {
        await prisma.$connect();
        const e = await prisma.adEvent.create({ data: { campaignId, userId, type: 'IMPRESSION', metadata: meta } });
        (0, eventBus_1.publish)('ad.impression', { campaignId, eventId: e.id });
        return e;
    }
    catch (err) {
        return { error: err.message };
    }
}
async function recordClick(campaignId, userId, meta) {
    try {
        await prisma.$connect();
        const e = await prisma.adEvent.create({ data: { campaignId, userId, type: 'CLICK', metadata: meta } });
        (0, eventBus_1.publish)('ad.click', { campaignId, eventId: e.id });
        return e;
    }
    catch (err) {
        return { error: err.message };
    }
}
