// server/src/modules/notifications/notification.controller.ts
import { Request, Response } from 'express';
import { asyncHandler } from '@/middleware/async.middleware';
import { sendSuccess } from '@/utils/response';
import {
  getUserNotifications,
  markAsRead,
  markAllAsRead,
  getUnreadCount,
} from './notification.service';

// GET /notifications
export const getUserNotificationsController = asyncHandler(
  async (req: Request, res: Response): Promise<void> => {
    const userId = req.user!.id;
    const { notifications, meta } = await getUserNotifications(
      userId,
      req.query as Record<string, string>
    );

    sendSuccess(res, 'Notifications fetched successfully', notifications, meta);
  }
);

// GET /notifications/unread-count  ← must be registered BEFORE /:id
export const getUnreadCountController = asyncHandler(
  async (req: Request, res: Response): Promise<void> => {
    const userId = req.user!.id;
    const data = await getUnreadCount(userId);

    sendSuccess(res, 'Unread count fetched successfully', data);
  }
);

// PATCH /notifications/read-all  ← must be registered BEFORE /:id/read
export const markAllAsReadController = asyncHandler(
  async (req: Request, res: Response): Promise<void> => {
    const userId = req.user!.id;
    const data = await markAllAsRead(userId);

    sendSuccess(res, 'All notifications marked as read', data);
  }
);

// PATCH /notifications/:id/read
export const markAsReadController = asyncHandler(
  async (req: Request, res: Response): Promise<void> => {
    const { id } = req.params as { id: string };
    const userId = req.user!.id;

    const notification = await markAsRead(id, userId);

    sendSuccess(res, 'Notification marked as read', notification);
  }
);