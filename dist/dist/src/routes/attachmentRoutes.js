"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const attachmentController_1 = require("../controllers/attachmentController");
const router = (0, express_1.Router)();
router.post('/', attachmentController_1.createAttachmentHandler);
router.get('/upload/:key', attachmentController_1.getUploadUrlHandler);
router.get('/download/:key', attachmentController_1.getDownloadUrlHandler);
exports.default = router;
