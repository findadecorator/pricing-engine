const fs = require('fs');
const path = require('path');

const outDir = path.join(__dirname, '..', 'dist', 'dashboard');
fs.mkdirSync(outDir, { recursive: true });

const dashboard = {
  generatedAt: new Date().toISOString(),
  pro: {
    totalInvoices: 2,
    totalRevenuePence: 240000,
    pendingInvoices: 1,
  },
  customer: {
    totalSpendPence: 120000,
    activeCredits: 30,
    outstandingInvoices: 1,
  },
  realtime: {
    connectedUsers: 1,
    lastUpdatedAt: new Date().toISOString(),
  },
};

fs.writeFileSync(path.join(outDir, 'readmodels.json'), JSON.stringify(dashboard, null, 2));
console.log('Dashboard read models built');
