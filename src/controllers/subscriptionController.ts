import { Request, Response } from 'express';
import { applySubscription, cancelSubscription, renewSubscription } from '../services/subscriptionService';

export async function subscribeHandler(req: Request, res: Response) {
  const { userId, plan } = req.body;
  const r = await applySubscription(userId, plan, req.body.meta);
  return res.json(r);
}

export async function renewHandler(req: Request, res: Response) {
  const { userId, plan } = req.body;
  const r = await renewSubscription(userId, plan, req.body.meta);
  return res.json(r);
}

export async function cancelHandler(req: Request, res: Response) {
  const { userId } = req.body;
  const r = await cancelSubscription(userId);
  return res.json(r);
}
