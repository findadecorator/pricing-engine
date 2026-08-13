"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const subscriptionController_1 = require("../controllers/subscriptionController");
const router = (0, express_1.Router)();
router.post('/subscribe', subscriptionController_1.subscribeHandler);
router.post('/renew', subscriptionController_1.renewHandler);
router.post('/cancel', subscriptionController_1.cancelHandler);
exports.default = router;
