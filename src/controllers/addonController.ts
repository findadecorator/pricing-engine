import { Request, Response } from 'express';
import { purchaseAddon, listActiveAddons } from '../services/addonService';

export async function purchaseAddonHandler(req: Request, res: Response) {
  const { userId, addonId } = req.body;
  const r = await purchaseAddon(userId, addonId);
  return res.json(r);
}

export async function listAddonsHandler(req: Request, res: Response) {
  const userId = req.query.userId as string;
  const r = await listActiveAddons(userId);
  return res.json(r);
}
