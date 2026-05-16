// server/src/modules/payments/payment.routes.ts
import { Router } from 'express';
import { authenticate } from '@/middlewares/auth.middleware';
import { validate } from '@/middlewares/validate.middleware';
import { z } from 'zod';
import {
  initiatePaymentController,
  handleSuccessController,
  handleFailController,
  handleCancelController,
  handleIPNController,
} from './payment.controller';

const router = Router();

const initiatePaymentSchema = z.object({
  donationId: z.string().min(1, 'donationId is required'),
});

// POST /api/v1/payments/initiate — donor must be authenticated
router.post(
  '/initiate',
  authenticate,
  validate(initiatePaymentSchema),
  initiatePaymentController
);

// SSLCommerz server-to-server callbacks — NO auth
router.post('/success', handleSuccessController);
router.post('/fail', handleFailController);
router.post('/cancel', handleCancelController);
router.post('/ipn', handleIPNController);

export default router;