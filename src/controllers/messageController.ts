import { Request, Response } from "express";
import {
  createConversation,
  getConversations,
  postMessage,
  getConversation,
  markAsRead,
  getUnreadCount,
} from "../services/messageService";

export async function createConversationHandler(req: Request, res: Response) {
  const createdBy = req.user?.id ?? req.body.createdBy;
  const conv = await createConversation({ ...req.body, createdBy });
  return res.status(201).json(conv);
}

export async function listConversationsHandler(req: Request, res: Response) {
  const userId = req.user?.id ?? String(req.query.userId ?? "");
  const conversations = await getConversations(userId);
  return res.json(conversations);
}

export async function getConversationHandler(req: Request, res: Response) {
  const id = String(req.params.id ?? "");
  const userId = req.user?.id ?? String(req.query.userId ?? "");
  const resp = await getConversation(id, userId);
  return res.json(resp);
}

export async function postMessageHandler(req: Request, res: Response) {
  const { id } = req.params;
  const raw = req.headers["idempotency-key"];
  const idempotencyKey = raw ? (Array.isArray(raw) ? raw[0] : raw) : undefined;
  const senderId = req.user?.id ?? String(req.body.senderId ?? "");
  const body = String(req.body.body ?? "");
  const attachments = Array.isArray(req.body.attachments) ? req.body.attachments : req.body.attachments ? [req.body.attachments] : [];
  const msg = await postMessage({ conversationId: id, senderId, body, attachments, idempotencyKey });
  return res.status(201).json(msg);
}

export async function markAsReadHandler(req: Request, res: Response) {
  const id = String(req.params.id ?? "");
  const userId = req.user?.id ?? String(req.body.userId ?? "");
  const r = await markAsRead(id, userId);
  return res.json(r);
}

export async function getUnreadCountHandler(req: Request, res: Response) {
  const userId = req.user?.id ?? String(req.query.userId ?? "");
  const count = await getUnreadCount(userId);
  return res.json({ userId, unread: count });
}
