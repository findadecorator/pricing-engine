import { Request, Response } from 'express';
import { enqueueNotification, deliverNotification } from '../services/notificationService';

export async function enqueueHandler(req: Request, res: Response) {
  const n = await enqueueNotification(req.body);
  return res.status(201).json(n);
}

export async function deliverHandler(req: Request, res: Response) {
  const id = String(req.params.id || '');
  const r = await deliverNotification(id);
  return res.json(r);
}
