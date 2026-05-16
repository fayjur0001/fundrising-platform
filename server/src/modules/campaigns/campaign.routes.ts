import { Router } from 'express'
import { Role } from '@prisma/client'

import * as campaignController from './campaign.controller'

import { authenticate, authorize } from '../../middlewares/auth.middleware'
import { validate } from '../../middlewares/validate.middleware'
import { uploadSingle } from '../../middlewares/upload.middleware'

import {
  createCampaignSchema,
  updateCampaignSchema,
  adminUpdateSchema,
  addCampaignUpdateSchema,
} from './campaign.schema'

const router = Router()

// =========================
// PUBLIC ROUTES
// =========================

// Public: list active campaigns
router.get('/', campaignController.getAllCampaigns)

// Public: single campaign by slug
// MUST stay after /my and /admin/*
router.get('/:slug', campaignController.getCampaignBySlug)

// =========================
// CREATOR ROUTES
// =========================

// Creator: own campaigns
router.get(
  '/my',
  authenticate,
  authorize(Role.CREATOR),
  campaignController.getMyCampaigns
)

// Creator: create campaign
router.post(
  '/',
  authenticate,
  authorize(Role.CREATOR),
  uploadSingle,
  validate(createCampaignSchema),
  campaignController.createCampaign
)

// Creator: update own campaign
router.put(
  '/:id',
  authenticate,
  authorize(Role.CREATOR),
  validate(updateCampaignSchema),
  campaignController.updateCampaign
)

// Creator: upload cover image
router.patch(
  '/:slug/cover',
  authenticate,
  authorize(Role.CREATOR),
  uploadSingle,
  campaignController.uploadCover
)

// Creator: add campaign update
router.post(
  '/:id/updates',
  authenticate,
  authorize(Role.CREATOR),
  validate(addCampaignUpdateSchema),
  campaignController.addCampaignUpdate
)

// =========================
// ADMIN ROUTES
// =========================

// Admin: all campaigns
router.get(
  '/admin/all',
  authenticate,
  authorize(Role.ADMIN),
  campaignController.getAdminAllCampaigns
)

// Admin: update any campaign
router.patch(
  '/admin/:id',
  authenticate,
  authorize(Role.ADMIN),
  validate(adminUpdateSchema),
  campaignController.adminUpdateCampaign
)

// =========================
// DELETE ROUTE
// =========================

// Creator or Admin: delete campaign
router.delete(
  '/:id',
  authenticate,
  campaignController.deleteCampaign
)

export default router