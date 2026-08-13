"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const messageController_1 = require("../controllers/messageController");
const auth_1 = __importDefault(require("../middleware/auth"));
const router = (0, express_1.Router)();
router.use(auth_1.default);
router.post('/conversations', messageController_1.createConversationHandler);
router.get('/conversations/:id', messageController_1.getConversationHandler);
router.get('/conversations/:id/messages', messageController_1.getConversationHandler);
router.post('/conversations/:id/messages', messageController_1.postMessageHandler);
router.post('/messages/:id/read', messageController_1.markAsReadHandler);
router.get('/unread-count', messageController_1.getUnreadCountHandler);
exports.default = router;
