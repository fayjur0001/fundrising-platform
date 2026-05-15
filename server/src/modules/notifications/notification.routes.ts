// server/src/modules/notifications/notification.routes.ts
import { Router } from 'express';
import { authenticate } from '@/middleware/auth.middleware';
import {
  getUserNotificationsController,
  getUnreadCountController,
  markAllAsReadController,
  markAsReadController,
} from './notification.controller';

const router = Router();

// All routes require authentication
router.use(authenticate);

// ⚠️ ROUTE ORDER CRITICAL:
// /unread-count and /read-all MUST come before /:id and /:id/read
// Otherwise Express matches "unread-count" and "read-all" as :id param

// GET  /api/v1/notifications
router.get('/', getUserNotificationsController);

// GET  /api/v1/notifications/unread-count  ← BEFORE /:id
router.get('/unread-count', getUnreadCountController);

// PATCH /api/v1/notifications/read-all     ← BEFORE /:id/read
router.patch('/read-all', markAllAsReadController);

// PATCH /api/v1/notifications/:id/read
router.patch('/:id/read', markAsReadController);

export default router;