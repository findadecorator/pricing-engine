"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.subscribeHandler = subscribeHandler;
exports.renewHandler = renewHandler;
exports.cancelHandler = cancelHandler;
const subscriptionService_1 = require("../services/subscriptionService");
async function subscribeHandler(req, res) {
    const { userId, plan } = req.body;
    const r = await (0, subscriptionService_1.applySubscription)(userId, plan, req.body.meta);
    return res.json(r);
}
async function renewHandler(req, res) {
    const { userId, plan } = req.body;
    const r = await (0, subscriptionService_1.renewSubscription)(userId, plan, req.body.meta);
    return res.json(r);
}
async function cancelHandler(req, res) {
    const { userId } = req.body;
    const r = await (0, subscriptionService_1.cancelSubscription)(userId);
    return res.json(r);
}
