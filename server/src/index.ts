import 'dotenv/config'; // ← MUST BE FIRST — before all other imports

import express, { Request, Response, NextFunction } from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import cookieParser from 'cookie-parser';
import rateLimit from 'express-rate-limit';
import path from 'path';

import { env } from '@/config/env';
import { corsOptions } from '@/config/cors';
import { prisma } from '@/config/database';
import { errorMiddleware } from '@/middlewares/error.middleware';

// ── Route imports ─────────────────────────────────────────────────────────
import authRoutes         from '@/modules/auth/auth.routes';
import userRoutes         from '@/modules/users/user.routes';
import campaignRoutes     from '@/modules/campaigns/campaign.routes';
import donationRoutes     from '@/modules/donations/donation.routes';
import paymentRoutes      from '@/modules/payments/payment.routes';
import commentRoutes      from '@/modules/comments/comment.routes';
import notificationRoutes from '@/modules/notifications/notification.routes';
import analyticsRoutes    from '@/modules/analytics/analytics.routes';

// ── App ───────────────────────────────────────────────────────────────────
const app = express();

// ── Rate limiters ─────────────────────────────────────────────────────────
// Development-এ rate limit সম্পূর্ণ বন্ধ — বারবার test করলেও block হবে না।
// Production-এ সঠিক limit চালু থাকবে।

const isDev = env.NODE_ENV === 'development';

const generalLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,           // 15 minutes
  max: isDev ? 10_000 : 500,           // dev: unlimited practical, prod: 500/15min
  standardHeaders: true,
  legacyHeaders: false,
  skip: () => isDev,                   // dev-এ সব request skip — zero overhead
  message: {
    success: false,
    message: 'Too many requests, please try again after 15 minutes.',
  },
});

const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,           // 15 minutes
  max: isDev ? 10_000 : 100,           // dev: unlimited, prod: 100/15min (আগে ছিল 10!)
  standardHeaders: true,
  legacyHeaders: false,
  skip: () => isDev,                   // dev-এ auth limit সম্পূর্ণ বন্ধ
  message: {
    success: false,
    message: 'Too many auth attempts, please try again after 15 minutes.',
  },
});

// ── Middleware stack (ORDER MATTERS) ──────────────────────────────────────
app.use(helmet());
app.use(cors(corsOptions));
app.options('*', cors(corsOptions)); // preflight

app.use(cookieParser()); // required for req.cookies.refreshToken

app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

if (isDev) {
  app.use(morgan('dev'));
}

app.use(generalLimiter);

// ── Static files ──────────────────────────────────────────────────────────
app.use(
  '/uploads',
  express.static(path.join(process.cwd(), env.UPLOAD_DIR))
);

// ── Health check ──────────────────────────────────────────────────────────
app.get('/health', (_req: Request, res: Response) => {
  res.status(200).json({
    success: true,
    status: 'ok',
    timestamp: new Date().toISOString(),
    env: env.NODE_ENV,
  });
});

// ── Routes ────────────────────────────────────────────────────────────────
app.use('/api/v1/auth',          authLimiter, authRoutes);
app.use('/api/v1/users',         userRoutes);
app.use('/api/v1/campaigns',     campaignRoutes);
app.use('/api/v1/donations',     donationRoutes);
app.use('/api/v1/payments',      paymentRoutes);
app.use('/api/v1/comments',      commentRoutes);
app.use('/api/v1/notifications', notificationRoutes);
app.use('/api/v1/analytics',     analyticsRoutes);

// ── 404 handler ───────────────────────────────────────────────────────────
app.use((req: Request, res: Response) => {
  res.status(404).json({
    success: false,
    message: `Route ${req.method} ${req.path} not found`,
  });
});

// ── Error middleware (MUST be last app.use()) ─────────────────────────────
app.use(errorMiddleware);

// ── Start server ──────────────────────────────────────────────────────────
const PORT = env.PORT ?? 5000;

const server = app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
  console.log(`   Environment : ${env.NODE_ENV}`);
  console.log(`   Rate limit  : ${isDev ? 'disabled (dev mode)' : 'enabled (production)'}`);
  console.log(`   DB          : connected via Prisma`);
});

// ── Graceful shutdown ─────────────────────────────────────────────────────
const shutdown = async (signal: string): Promise<void> => {
  console.log(`\n${signal} received — shutting down gracefully...`);

  server.close(async () => {
    console.log('HTTP server closed.');
    await prisma.$disconnect();
    console.log('Prisma disconnected. Goodbye.');
    process.exit(0);
  });

  // Force exit after 10s if server hasn't closed
  setTimeout(() => {
    console.error('Forced shutdown after timeout.');
    process.exit(1);
  }, 10_000);
};

process.on('SIGTERM', () => void shutdown('SIGTERM'));
process.on('SIGINT',  () => void shutdown('SIGINT'));

// Unhandled promise rejections — log and exit
process.on('unhandledRejection', (reason: unknown) => {
  console.error('Unhandled Rejection:', reason);
  void shutdown('unhandledRejection');
});

export default app;