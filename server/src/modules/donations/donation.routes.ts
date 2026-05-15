import { Router } from 'express'
import * as donationController from './donation.controller'
import { authenticate, authorize } from '../../middlewares/auth.middleware'
import { validate } from '../../middlewares/validate.middleware'
import { createDonationSchema } from './donation.schema'

const router = Router()

// ⚠️ ORDER IS CRITICAL — named routes BEFORE /:id

// Public: campaign donations (anonymous masked)
router.get('/campaign/:id', donationController.getCampaignDonations)

// Donor: own donations
router.get('/my', authenticate, donationController.getMyDonations)

// Creator: donations to their campaigns
router.get('/creator', authenticate, authorize('CREATOR'), donationController.getCreatorDonations)

// Admin: all donations
router.get('/admin/all', authenticate, authorize('ADMIN'), donationController.getAllDonations)

// Authenticated: create donation
router.post('/', authenticate, validate(createDonationSchema), donationController.initiateDonation)

// Authenticated: single donation by id — MUST be last
router.get('/:id', authenticate, donationController.getDonationById)

export default router