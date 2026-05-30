// server/src/modules/reports/report.routes.ts
import { Router } from 'express';
import { Role } from '../../types/prisma-enums';
import { authenticate, authorize } from '@/middlewares/auth.middleware';
import {
  createReportController,
  getAdminReportsController,
  updateReportController,
} from './report.controller';

const router = Router();

// POST /reports — যেকোনো logged-in user report করতে পারবে
router.post('/', authenticate, createReportController);

// GET /reports/admin — admin only
router.get('/admin', authenticate, authorize(Role.ADMIN), getAdminReportsController);

// PATCH /reports/:id — admin only (review / dismiss)
router.patch('/:id', authenticate, authorize(Role.ADMIN), updateReportController);

export default router;