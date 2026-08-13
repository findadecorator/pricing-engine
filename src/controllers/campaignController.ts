import { Request, Response } from 'express';
import { createCampaign, recordImpression, recordClick } from '../services/adService';

export async function createCampaignHandler(req: Request, res: Response) {
  const c = await createCampaign(req.body);
  return res.status(201).json(c);
}

export async function performanceHandler(req: Request, res: Response) {
  const { id } = req.params;
  // simplified: return counts
  return res.json({ campaignId: id, impressions: 0, clicks: 0 });
}

export async function impressionHandler(req: Request, res: Response) {
  const { campaignId } = req.body;
  const r = await recordImpression(campaignId, req.body.userId, req.body.meta);
  return res.json(r);
}

export async function clickHandler(req: Request, res: Response) {
  const { campaignId } = req.body;
  const r = await recordClick(campaignId, req.body.userId, req.body.meta);
  return res.json(r);
}
