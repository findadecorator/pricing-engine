const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function run() {
  const retentionDays = 90;
  const cutoff = new Date(Date.now() - retentionDays * 24 * 3600 * 1000);
  console.log('Purging messages before', cutoff.toISOString());
  try {
    const res = await prisma.message.deleteMany({ where: { createdAt: { lt: cutoff } } });
    console.log('Deleted', res.count, 'messages');
  } catch (err) {
    console.error('Retention error', err.message);
  }
  process.exit(0);
}

run().catch((e)=>{ console.error(e); process.exit(1); });
