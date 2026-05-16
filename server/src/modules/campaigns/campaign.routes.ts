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

// ⚠️ ORDER IS CRITICAL — specific routes before param routes

// Creator: own campaigns — MUST be before /:slug
router.get('/my', authenticate, authorize(Role.CREATOR), campaignController.getMyCampaigns)

// Admin: all campaigns — MUST be before /:slug
router.get('/admin/all', authenticate, authorize(Role.ADMIN), campaignController.getAdminAllCampaigns)

// Admin: update any campaign — MUST be before /:slug
router.patch(
  '/admin/:id',
  authenticate,
  authorize(Role.ADMIN),
  validate(adminUpdateSchema),
  campaignController.adminUpdateCampaign
)

// Public: list (ACTIVE only)
router.get('/', campaignController.getAllCampaigns)

// Public: single campaign by slug — MUST be after /my and /admin/*
router.patch(
  '/:slug/cover',
  authenticate,
  authorize(Role.CREATOR),
  uploadSingle,
  campaignController.uploadCover
)
router.get('/:slug', campaignController.getCampaignBySlug)

// Creator: create
router.post(
  '/',
  authenticate,
  authorize(Role.CREATOR),
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

// Creator or Admin: delete
router.delete('/:id', authenticate, campaignController.deleteCampaign)

// Creator: post campaign update
router.post(
  '/:id/updates',
  authenticate,
  authorize(Role.CREATOR),
  validate(addCampaignUpdateSchema),
  campaignController.addCampaignUpdate
)

export default router