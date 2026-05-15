// server/src/modules/analytics/analytics.routes.ts
import { Router } from 'express';
import { authenticate, authorize } from '@/middleware/auth.middleware';
import {
  getPlatformStatsController,
  getAdminDonationTrendController,
  getCreatorStatsController,
  getCreatorDonationTrendController,
  getDonorStatsController,
} from './analytics.controller';

const router = Router();

// All routes require authentication
router.use(authenticate);

// ── Admin ──────────────────────────────────────────────────────────────────
// ⚠️ /platform/trend BEFORE /platform — more specific path first
router.get('/platform/trend', authorize('ADMIN'), getAdminDonationTrendController);
router.get('/platform', authorize('ADMIN'), getPlatformStatsController);

// ── Creator ────────────────────────────────────────────────────────────────
// ⚠️ /creator/trend BEFORE /creator — more specific path first
router.get('/creator/trend', authorize('CREATOR'), getCreatorDonationTrendController);
router.get('/creator', authorize('CREATOR'), getCreatorStatsController);

// ── Donor ──────────────────────────────────────────────────────────────────
router.get('/donor', authorize('DONOR'), getDonorStatsController);

export default router;