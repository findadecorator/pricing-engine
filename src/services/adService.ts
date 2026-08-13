import { PrismaClient } from '@prisma/client';
import { recordLedger } from '../lib/ledger';
import { publish } from '../lib/eventBus';

const prisma = new PrismaClient();

export async function createCampaign(data: any) {
  try {
    await prisma.$connect();
    const c = await prisma.campaign.create({ data });
    recordLedger({ type: 'campaign.created', campaignId: c.id });
    publish('campaign.created', { userId: data.userId, campaignId: c.id, campaign: c });
    return c;
  } catch (err) {
    return { error: (err as Error).message };
  }
}

export async function recordImpression(campaignId: string, userId?: string, meta?: any) {
  try {
    await prisma.$connect();
    const e = await prisma.adEvent.create({ data: { campaignId, userId, type: 'IMPRESSION', metadata: meta } as any });
    publish('ad.impression', { campaignId, eventId: e.id });
    return e;
  } catch (err) {
    return { error: (err as Error).message };
  }
}

export async function recordClick(campaignId: string, userId?: string, meta?: any) {
  try {
    await prisma.$connect();
    const e = await prisma.adEvent.create({ data: { campaignId, userId, type: 'CLICK', metadata: meta } as any });
    publish('ad.click', { campaignId, eventId: e.id });
    return e;
  } catch (err) {
    return { error: (err as Error).message };
  }
}
