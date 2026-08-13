"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createCampaignHandler = createCampaignHandler;
exports.performanceHandler = performanceHandler;
exports.impressionHandler = impressionHandler;
exports.clickHandler = clickHandler;
const adService_1 = require("../services/adService");
async function createCampaignHandler(req, res) {
    const c = await (0, adService_1.createCampaign)(req.body);
    return res.status(201).json(c);
}
async function performanceHandler(req, res) {
    const { id } = req.params;
    // simplified: return counts
    return res.json({ campaignId: id, impressions: 0, clicks: 0 });
}
async function impressionHandler(req, res) {
    const { campaignId } = req.body;
    const r = await (0, adService_1.recordImpression)(campaignId, req.body.userId, req.body.meta);
    return res.json(r);
}
async function clickHandler(req, res) {
    const { campaignId } = req.body;
    const r = await (0, adService_1.recordClick)(campaignId, req.body.userId, req.body.meta);
    return res.json(r);
}
