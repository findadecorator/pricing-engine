"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const notificationController_1 = require("../controllers/notificationController");
const router = (0, express_1.Router)();
router.post('/', notificationController_1.enqueueHandler);
router.post('/:id/deliver', notificationController_1.deliverHandler);
exports.default = router;
