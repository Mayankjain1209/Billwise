import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient({
  datasources: {
    db: {
      url: process.env.DATABASE_URL,
    },
  },
  log: process.env.NODE_ENV === 'development' ? ['query', 'error', 'warn'] : ['error'],
});

// Graceful shutdown
process.on('beforeExit', async () => {
  await prisma.$disconnect();
});

// Test connection on startup
prisma.$connect()
  .then(() => {
    console.log('✅ Prisma connected to Neon Database');
    const dbHost = process.env.DATABASE_URL?.split('@')[1]?.split('/')[0];
    console.log(`📊 Database Host: ${dbHost}`);
  })
  .catch((err) => {
    console.error('❌ Prisma connection failed:', err.message);
    console.error('Full error:', err);
  });

export default prisma;
