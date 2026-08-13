"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getProDashboard = getProDashboard;
exports.getCustomerDashboard = getCustomerDashboard;
exports.getRealtimeDashboard = getRealtimeDashboard;
const fs_1 = require("fs");
const path_1 = require("path");
function loadReadModels() {
    const filePath = (0, path_1.join)(__dirname, '..', 'dist', 'dashboard', 'readmodels.json');
    try {
        return JSON.parse((0, fs_1.readFileSync)(filePath, 'utf8'));
    }
    catch {
        return {
            pro: { totalInvoices: 0, totalRevenuePence: 0, pendingInvoices: 0 },
            customer: { totalSpendPence: 0, activeCredits: 0, outstandingInvoices: 0 },
            realtime: { connectedUsers: 0, lastUpdatedAt: new Date().toISOString() },
        };
    }
}
async function getProDashboard(_req, res) {
    const readModels = loadReadModels();
    res.json({ success: true, dashboard: readModels.pro });
}
async function getCustomerDashboard(_req, res) {
    const readModels = loadReadModels();
    res.json({ success: true, dashboard: readModels.customer });
}
async function getRealtimeDashboard(_req, res) {
    const readModels = loadReadModels();
    res.json({ success: true, dashboard: readModels.realtime });
}
