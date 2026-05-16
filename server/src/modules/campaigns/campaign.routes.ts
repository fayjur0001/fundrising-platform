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

// =========================
// ADMIN ROUTES
// =========================
// NOTE: /admin/* routes MUST come before /:slug — otherwise Express
// treats the string "admin" as a slug param and never reaches these.

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
// CREATOR ROUTES
// =========================
// NOTE: /my MUST come before /:slug for the same reason.

// Creator: own campaigns
router.get(
  '/my',
  authenticate,
  authorize(Role.CREATOR),
  campaignController.getMyCampaigns
)

// Creator: create campaign
// FIX: uploadSingle (multer) মুছে ফেলা হয়েছে।
// Campaign create JSON body দিয়ে হয়; image upload আলাদা
// PATCH /:slug/cover endpoint দিয়ে হয়।
// Multer active থাকলে express.json() body parse করতে পারে না —
// req.body empty হয়, validate fail হয়, campaign তৈরিই হয় না।
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

// Creator: upload cover image (multipart — multer শুধু এখানে)
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
// PUBLIC: single campaign by slug
// =========================
// NOTE: এই route সবার শেষে — নাহলে /my, /admin/all সব
// এই wildcard-এ আটকে যাবে।
router.get('/:slug', campaignController.getCampaignBySlug)

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