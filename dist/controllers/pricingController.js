"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.pricingInfo = pricingInfo;
exports.buyPack = buyPack;
const pricingEngine_1 = require("../services/pricingEngine");
const creditService_1 = require("../services/creditService");
async function pricingInfo(_req, res) {
    const packs = (0, pricingEngine_1.getAvailablePacks)();
    res.json({
        success: true,
        currency: 'USD',
        packs,
    });
}
async function buyPack(req, res) {
    const { userId, credits, packName } = req.body ?? {};
    if (!userId) {
        return res.status(400).json({ success: false, message: 'userId is required' });
    }
    const requestedCredits = typeof credits === 'number' ? credits : 0;
    const result = await (0, creditService_1.buyCredits)(userId, requestedCredits, packName);
    const balance = await (0, creditService_1.getUserCredits)(userId);
    return res.json({
        ...result,
        balance,
    });
}
