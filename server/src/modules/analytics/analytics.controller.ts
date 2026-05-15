// server/src/modules/analytics/analytics.controller.ts
import { Request, Response } from 'express';
import { asyncHandler } from '@/middleware/async.middleware';
import { sendSuccess } from '@/utils/response';
import {
  getPlatformStats,
  getAdminDonationTrend,
  getCreatorStats,
  getCreatorDonationTrend,
  getDonorStats,
} from './analytics.service';

// GET /analytics/platform  [admin]
export const getPlatformStatsController = asyncHandler(
  async (_req: Request, res: Response): Promise<void> => {
    const data = await getPlatformStats();
    sendSuccess(res, 'Platform stats fetched successfully', data);
  }
);

// GET /analytics/platform/trend  [admin]
export const getAdminDonationTrendController = asyncHandler(
  async (req: Request, res: Response): Promise<void> => {
    const data = await getAdminDonationTrend(
      req.query as { days?: string }
    );
    sendSuccess(res, 'Donation trend fetched successfully', data);
  }
);

// GET /analytics/creator  [creator]
export const getCreatorStatsController = asyncHandler(
  async (req: Request, res: Response): Promise<void> => {
    const creatorId = req.user!.id;
    const data = await getCreatorStats(creatorId);
    sendSuccess(res, 'Creator stats fetched successfully', data);
  }
);

// GET /analytics/creator/trend  [creator]
export const getCreatorDonationTrendController = asyncHandler(
  async (req: Request, res: Response): Promise<void> => {
    const creatorId = req.user!.id;
    const data = await getCreatorDonationTrend(creatorId);
    sendSuccess(res, 'Creator donation trend fetched successfully', data);
  }
);

// GET /analytics/donor  [donor]
export const getDonorStatsController = asyncHandler(
  async (req: Request, res: Response): Promise<void> => {
    const donorId = req.user!.id;
    const data = await getDonorStats(donorId);
    sendSuccess(res, 'Donor stats fetched successfully', data);
  }
);