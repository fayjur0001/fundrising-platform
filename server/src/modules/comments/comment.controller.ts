// server/src/modules/comments/comment.controller.ts
import { Request, Response } from 'express';
import { asyncHandler } from '@/middleware/async.middleware';
import { sendSuccess, sendCreated } from '@/utils/response';
import {
  getCampaignComments,
  addComment,
  deleteComment,
} from './comment.service';

export const getCampaignCommentsController = asyncHandler(
  async (req: Request, res: Response): Promise<void> => {
    const { id: campaignId } = req.params as { id: string };
    const { comments, meta } = await getCampaignComments(campaignId, req.query as Record<string, string>);

    sendSuccess(res, 'Comments fetched successfully', comments, meta);
  }
);

export const addCommentController = asyncHandler(
  async (req: Request, res: Response): Promise<void> => {
    const { id: campaignId } = req.params as { id: string };
    const userId = req.user!.id;
    const { content } = req.body as { content: string };

    const comment = await addComment(userId, campaignId, content);

    sendCreated(res, 'Comment added successfully', comment);
  }
);

export const deleteCommentController = asyncHandler(
  async (req: Request, res: Response): Promise<void> => {
    const { id } = req.params as { id: string };
    const userId = req.user!.id;
    const role = req.user!.role;

    await deleteComment(id, userId, role);

    sendSuccess(res, 'Comment deleted successfully', null);
  }
);