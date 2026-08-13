"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const leadController_1 = require("../controllers/leadController");
const router = (0, express_1.Router)();
router.post('/unlock', leadController_1.unlockJobHandler);
exports.default = router;
