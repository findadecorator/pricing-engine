import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import * as http from 'http';
import pricingRoutes from './routes/pricingRoutes';
import financeRoutes from './routes/financeRoutes';
import dashboardRoutes from './routes/dashboardRoutes';
import messageRoutes from './routes/messageRoutes';
import attachmentRoutes from './routes/attachmentRoutes';
import notificationRoutes from './routes/notificationRoutes';
import campaignRoutes from './routes/campaignRoutes';
import leadRoutes from './routes/leadRoutes';
import authRoutes from './routes/authRoutes';
import stripeRoutes from './routes/stripeRoutes';
import { initWS } from './services/websocketService';
import { PrismaClient } from '@prisma/client';

dotenv.config();

const app = express();
const port = Number(process.env.PORT ?? 4000);
const prisma = new PrismaClient();

app.use(cors({ origin: '*' }));

// Stripe webhook needs the raw body for signature verification — must come before express.json()
app.use('/api/stripe/webhook', express.raw({ type: 'application/json' }), (req: any, _res, next) => {
  req.rawBody = req.body;
  next();
});

app.use(express.json());

app.get('/health', async (_req, res) => {
  let dbStatus = 'unknown';
  try { await prisma.$queryRaw`SELECT 1`; dbStatus = 'ok'; } catch { dbStatus = 'fallback'; }
  res.json({ status: 'ok', db: dbStatus, ts: new Date().toISOString() });
});

// Public routes
app.use('/api/auth', authRoutes);
app.use('/api/pricing', pricingRoutes);
app.use('/api/stripe', stripeRoutes);

// Protected routes (auth middleware applied inside each router)
app.use('/api/finance', financeRoutes);
app.use('/api/dashboard', dashboardRoutes);
app.use('/api/messages', messageRoutes);
app.use('/api/attachments', attachmentRoutes);
app.use('/api/notifications', notificationRoutes);
app.use('/api/campaigns', campaignRoutes);
app.use('/api/leads', leadRoutes);

// user/me convenience alias
app.use('/api/user', authRoutes);

const httpServer = http.createServer(app);
initWS(httpServer);

httpServer.listen(port, '0.0.0.0', () => {
  console.log(`Pricing engine listening on port ${port}`);
});
