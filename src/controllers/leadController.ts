import { Request, Response } from 'express';
import { unlockJob } from '../services/leadService';

export async function unlockJobHandler(req: Request, res: Response) {
  const { userId, jobSize } = req.body;
  const raw = req.headers['idempotency-key'];
  const idempotencyKey = raw ? (Array.isArray(raw) ? raw[0] : raw) : undefined;
  const result = await unlockJob(userId, Number(jobSize), { idempotencyKey });
  if (result && 'error' in result && (result as any).error === 'INSUFFICIENT_CREDITS') {
    return res.status(402).json(result);
  }
  return res.json(result);
}
