"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const campaignController_1 = require("../controllers/campaignController");
const auth_1 = __importDefault(require("../middleware/auth"));
const router = (0, express_1.Router)();
router.use(auth_1.default);
router.post('/', campaignController_1.createCampaignHandler);
router.get('/:id/performance', campaignController_1.performanceHandler);
router.post('/impression', campaignController_1.impressionHandler);
router.post('/click', campaignController_1.clickHandler);
exports.default = router;
