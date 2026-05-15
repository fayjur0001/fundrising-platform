import { Request, Response } from 'express';
import { asyncHandler } from '@/middlewares/async.middleware';
import { sendSuccess, sendPaginated } from '@/utils/response';
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

    sendPaginated(res, notifications, meta, 'Notifications fetched successfully');
  }
);

// GET /notifications/unread-count
export const getUnreadCountController = asyncHandler(
  async (req: Request, res: Response): Promise<void> => {
    const userId = req.user!.id;
    const data = await getUnreadCount(userId);

    sendSuccess(res, data, 'Unread count fetched successfully');
  }
);

// PATCH /notifications/read-all
export const markAllAsReadController = asyncHandler(
  async (req: Request, res: Response): Promise<void> => {
    const userId = req.user!.id;
    const data = await markAllAsRead(userId);

    sendSuccess(res, data, 'All notifications marked as read');
  }
);

// PATCH /notifications/:id/read
export const markAsReadController = asyncHandler(
  async (req: Request, res: Response): Promise<void> => {
    const { id } = req.params as { id: string };
    const userId = req.user!.id;

    const notification = await markAsRead(id, userId);

    sendSuccess(res, notification, 'Notification marked as read');
  }
);