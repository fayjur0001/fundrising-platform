// server/src/modules/comments/comment.routes.ts
import { Router } from 'express';
import { z } from 'zod';
import { authenticate } from '@/middleware/auth.middleware';
import { validate } from '@/middleware/validate.middleware';
import {
  getCampaignCommentsController,
  addCommentController,
  deleteCommentController,
} from './comment.controller';

const router = Router();

const addCommentSchema = z.object({
  body: z.object({
    content: z
      .string()
      .min(1, 'Content must be at least 1 character')
      .max(500, 'Content must be at most 500 characters'),
  }),
});

// GET /api/v1/comments/campaign/:id — public
router.get('/campaign/:id', getCampaignCommentsController);

// POST /api/v1/comments/campaign/:id — authenticated
router.post(
  '/campaign/:id',
  authenticate,
  validate(addCommentSchema),
  addCommentController
);

// DELETE /api/v1/comments/:id — authenticated (owner or admin)
router.delete('/:id', authenticate, deleteCommentController);

export default router;