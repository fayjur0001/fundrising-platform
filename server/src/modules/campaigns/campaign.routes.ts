import { Router } from 'express'
import { Role } from '../../types/prisma-enums'

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






router.get('/', campaignController.getAllCampaigns)








router.get(
  '/admin/all',
  authenticate,
  authorize(Role.ADMIN),
  campaignController.getAdminAllCampaigns
)


router.patch(
  '/admin/:id',
  authenticate,
  authorize(Role.ADMIN),
  validate(adminUpdateSchema),
  campaignController.adminUpdateCampaign
)







router.get(
  '/my',
  authenticate,
  authorize(Role.CREATOR),
  campaignController.getMyCampaigns
)


router.post(
  '/',
  authenticate,
  authorize(Role.CREATOR),
  validate(createCampaignSchema),
  campaignController.createCampaign
)


router.put(
  '/:id',
  authenticate,
  authorize(Role.CREATOR),
  validate(updateCampaignSchema),
  campaignController.updateCampaign
)

router.post(
  '/:slug/cover',
  authenticate,
  authorize(Role.CREATOR),
  uploadSingle,
  campaignController.uploadCover
)


router.get(
  '/:id/updates',
  campaignController.getCampaignUpdates
)

router.post(
  '/:id/updates',
  authenticate,
  authorize(Role.CREATOR),
  validate(addCampaignUpdateSchema),
  campaignController.addCampaignUpdate
)







router.get(
  '/supported',
  authenticate,
  authorize(Role.DONOR),
  campaignController.getSupportedCampaigns
)






router.get('/:slug', campaignController.getCampaignBySlug)






router.delete(
  '/:id',
  authenticate,
  campaignController.deleteCampaign
)

export default router