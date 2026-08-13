"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.purchaseAddonHandler = purchaseAddonHandler;
exports.listAddonsHandler = listAddonsHandler;
const addonService_1 = require("../services/addonService");
async function purchaseAddonHandler(req, res) {
    const { userId, addonId } = req.body;
    const r = await (0, addonService_1.purchaseAddon)(userId, addonId);
    return res.json(r);
}
async function listAddonsHandler(req, res) {
    const userId = req.query.userId;
    const r = await (0, addonService_1.listActiveAddons)(userId);
    return res.json(r);
}
