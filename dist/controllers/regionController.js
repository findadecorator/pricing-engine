"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.allowedRegionsHandler = allowedRegionsHandler;
exports.isAllowedHandler = isAllowedHandler;
const regionService_1 = require("../services/regionService");
function allowedRegionsHandler(req, res) {
    const plan = req.query.plan;
    return res.json({ allowed: (0, regionService_1.allowedRegionsForPlan)(plan) });
}
function isAllowedHandler(req, res) {
    const user = req.body.user;
    const region = req.body.region;
    return res.json({ allowed: (0, regionService_1.isRegionAllowed)(user, region) });
}
