import { Router } from 'express'
import * as donationController from './donation.controller'
import { authenticate, authorize } from '../../middlewares/auth.middleware'
import { validate } from '../../middlewares/validate.middleware'
import { createDonationSchema } from './donation.schema'
import { initiatePayment } from '../payments/payment.service'
import { sendSuccess } from '../../utils/response'

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

// Authenticated: initiate payment for a donation
router.post(
  '/:donationId/pay',
  authenticate,
  async (req, res, next) => {
    try {
      const donorId = req.user!.id
      const { donationId } = req.params
      const data = await initiatePayment(donorId, donationId)
      sendSuccess(res, data, 'Payment initiated successfully')
    } catch (err) {
      next(err)
    }
  }
)

// ── MOCK PAYMENT CONFIRM ──────────────────────────────────────────────────
// Demo/dev only: authenticate middleware সরানো হয়েছে কারণ success page এ
// redirect হলে in-memory access token reset হয়ে যায়, ফলে 401 পেয়ে
// completeDonation() call হতো না এবং campaign এ raisedAmount/donorCount
// update হতো না।
// Production এ এই route use হয় না — SSLCommerz IPN/success webhook handle করে।
import { completeDonation } from './donation.service'

router.post(
  '/:donationId/mock-confirm',
  async (req, res, next) => {
    try {
      const { donationId } = req.params
      const result = await completeDonation(donationId)
      sendSuccess(res, result, 'Mock payment confirmed successfully')
    } catch (err) {
      next(err)
    }
  }
)

// Authenticated: single donation by id — MUST be last
router.get('/:id', authenticate, donationController.getDonationById)

export default router