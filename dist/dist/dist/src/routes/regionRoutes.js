"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const regionController_1 = require("../controllers/regionController");
const router = (0, express_1.Router)();
router.get('/allowed', regionController_1.allowedRegionsHandler);
router.post('/check', regionController_1.isAllowedHandler);
exports.default = router;
