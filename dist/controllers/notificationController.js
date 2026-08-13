"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.enqueueHandler = enqueueHandler;
exports.deliverHandler = deliverHandler;
const notificationService_1 = require("../services/notificationService");
async function enqueueHandler(req, res) {
    const n = await (0, notificationService_1.enqueueNotification)(req.body);
    return res.status(201).json(n);
}
async function deliverHandler(req, res) {
    const id = String(req.params.id || '');
    const r = await (0, notificationService_1.deliverNotification)(id);
    return res.json(r);
}
