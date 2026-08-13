import { Request, Response } from 'express';
import { getAvailablePacks } from '../services/pricingEngine';
import { buyCredits, getUserCredits } from '../services/creditService';

export async function pricingInfo(_req: Request, res: Response) {
  const packs = getAvailablePacks();
  res.json({
    success: true,
    currency: 'USD',
    packs,
  });
}

export async function buyPack(req: Request, res: Response) {
  const { userId, credits, packName } = req.body ?? {};

  if (!userId) {
    return res.status(400).json({ success: false, message: 'userId is required' });
  }

  const requestedCredits = typeof credits === 'number' ? credits : 0;
  const result = await buyCredits(userId, requestedCredits, packName);
  const balance = await getUserCredits(userId);

  return res.json({
    ...result,
    balance,
  });
}
