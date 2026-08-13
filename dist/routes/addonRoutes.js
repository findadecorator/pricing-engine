"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const addonController_1 = require("../controllers/addonController");
const router = (0, express_1.Router)();
router.post('/purchase', addonController_1.purchaseAddonHandler);
router.get('/list', addonController_1.listAddonsHandler);
exports.default = router;
