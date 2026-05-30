import { Router } from 'express'
import * as donationController from './donation.controller'
import { authenticate, authorize } from '../../middlewares/auth.middleware'
import { validate } from '../../middlewares/validate.middleware'
import { createDonationSchema } from './donation.schema'
// BUG FIX: client calls POST /donations/:donationId/pay — route ছিল না
// payment.routes.ts-এ POST /payments/initiate আছে, কিন্তু client
// /donations/{id}/pay দিয়ে call করে। এখানে সরাসরি payment service
// import করে /:donationId/pay route যোগ করা হলো।
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
// Client: donationApi.initiatePayment(donationId) → POST /donations/:donationId/pay
// NOTE: এই route /:id এর আগে আসতে হবে, নাহলে "pay" কে id হিসেবে ধরবে
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

// Authenticated: single donation by id — MUST be last
router.get('/:id', authenticate, donationController.getDonationById)

export default router