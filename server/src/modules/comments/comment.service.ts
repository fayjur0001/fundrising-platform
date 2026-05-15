// server/src/modules/comments/comment.service.ts
import { prisma } from '@/lib/prisma';
import { createNotification } from '@/modules/notifications/notification.service';
import { PaginationMeta } from '@/types/response';

const COMMENT_SELECT = {
  id: true,
  content: true,
  createdAt: true,
  campaignId: true,
  user: {
    select: {
      id: true,
      name: true,
      avatar: true,
    },
  },
} as const;

interface CommentQuery {
  page?: string;
  limit?: string;
}

export const getCampaignComments = async (
  campaignId: string,
  query: CommentQuery
): Promise<{ comments: unknown[]; meta: PaginationMeta }> => {
  const page = Math.max(1, parseInt(query.page ?? '1', 10));
  const limit = Math.min(50, Math.max(1, parseInt(query.limit ?? '10', 10)));
  const skip = (page - 1) * limit;

  const [comments, total] = await prisma.$transaction([
    prisma.comment.findMany({
      where: { campaignId },
      select: COMMENT_SELECT,
      orderBy: { createdAt: 'desc' },
      skip,
      take: limit,
    }),
    prisma.comment.count({ where: { campaignId } }),
  ]);

  return {
    comments,
    meta: {
      page,
      limit,
      total,
      totalPages: Math.ceil(total / limit),
    },
  };
};

export const addComment = async (
  userId: string,
  campaignId: string,
  content: string
): Promise<unknown> => {
  const campaign = await prisma.campaign.findUnique({
    where: { id: campaignId },
    select: { id: true, status: true, creatorId: true, title: true },
  });

  if (!campaign) {
    const err = new Error('Campaign not found');
    (err as NodeJS.ErrnoException).code = '404';
    throw err;
  }

  if (campaign.status !== 'ACTIVE') {
    const err = new Error('Campaign is not active');
    (err as NodeJS.ErrnoException).code = '400';
    throw err;
  }

  const comment = await prisma.comment.create({
    data: {
      content,
      userId,
      campaignId,
    },
    select: COMMENT_SELECT,
  });

  if (campaign.creatorId !== userId) {
    await createNotification({
      userId: campaign.creatorId,
      type: 'COMMENT',
      title: 'New comment on your campaign',
      message: `Someone commented on "${campaign.title}"`,
      campaignId,
    });
  }

  return comment;
};

export const deleteComment = async (
  id: string,
  userId: string,
  role: string
): Promise<void> => {
  const comment = await prisma.comment.findUnique({
    where: { id },
    select: { id: true, userId: true },
  });

  if (!comment) {
    const err = new Error('Comment not found');
    (err as NodeJS.ErrnoException).code = '404';
    throw err;
  }

  const isOwner = comment.userId === userId;
  const isAdmin = role === 'ADMIN';

  if (!isOwner && !isAdmin) {
    const err = new Error('Forbidden: You cannot delete this comment');
    (err as NodeJS.ErrnoException).code = '403';
    throw err;
  }

  await prisma.comment.delete({ where: { id } });
};