"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const pricingController_1 = require("../controllers/pricingController");
const router = (0, express_1.Router)();
router.get('/info', pricingController_1.pricingInfo);
router.post('/buy-pack', pricingController_1.buyPack);
exports.default = router;
