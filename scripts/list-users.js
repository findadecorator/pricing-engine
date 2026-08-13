const { PrismaClient } = require('@prisma/client');
(async ()=>{
  const prisma = new PrismaClient();
  try {
    const users = await prisma.user.findMany({ select: { id: true, email: true }, take: 10 });
    console.log(JSON.stringify(users, null, 2));
    await prisma.$disconnect();
  } catch (e) {
    console.error('ERR', e.message || e);
    process.exit(1);
  }
})();
