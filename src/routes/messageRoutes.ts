import { Router } from "express";
import {
  createConversationHandler,
  listConversationsHandler,
  getConversationHandler,
  postMessageHandler,
  markAsReadHandler,
  getUnreadCountHandler,
} from "../controllers/messageController";
import requireAuth from "../middleware/auth";

const router = Router();
router.use(requireAuth);

router.get("/conversations", listConversationsHandler);
router.post("/conversations", createConversationHandler);
router.get("/conversations/:id", getConversationHandler);
router.get("/conversations/:id/messages", getConversationHandler);
router.post("/conversations/:id/messages", postMessageHandler);
router.post("/messages/:id/read", markAsReadHandler);
router.get("/unread-count", getUnreadCountHandler);

export default router;
