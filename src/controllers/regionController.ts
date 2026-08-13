import { Request, Response } from 'express';
import { allowedRegionsForPlan, isRegionAllowed } from '../services/regionService';

export function allowedRegionsHandler(req: Request, res: Response) {
  const plan = req.query.plan as string;
  return res.json({ allowed: allowedRegionsForPlan(plan) });
}

export function isAllowedHandler(req: Request, res: Response) {
  const user = req.body.user;
  const region = req.body.region;
  return res.json({ allowed: isRegionAllowed(user, region) });
}
