import { Request, Response } from 'express';
import { readFileSync } from 'fs';
import { join } from 'path';

function loadReadModels() {
  const filePath = join(__dirname, '..', 'dist', 'dashboard', 'readmodels.json');
  try {
    return JSON.parse(readFileSync(filePath, 'utf8'));
  } catch {
    return {
      pro: { totalInvoices: 0, totalRevenuePence: 0, pendingInvoices: 0 },
      customer: { totalSpendPence: 0, activeCredits: 0, outstandingInvoices: 0 },
      realtime: { connectedUsers: 0, lastUpdatedAt: new Date().toISOString() },
    };
  }
}

export async function getProDashboard(_req: Request, res: Response) {
  const readModels = loadReadModels();
  res.json({ success: true, dashboard: readModels.pro });
}

export async function getCustomerDashboard(_req: Request, res: Response) {
  const readModels = loadReadModels();
  res.json({ success: true, dashboard: readModels.customer });
}

export async function getRealtimeDashboard(_req: Request, res: Response) {
  const readModels = loadReadModels();
  res.json({ success: true, dashboard: readModels.realtime });
}
