import { Router } from 'express'
import * as authController from './auth.controller'
import { validate } from '../../middlewares/validate.middleware'
import { authenticate } from '../../middlewares/auth.middleware'
import {
  registerSchema,
  loginSchema,
  forgotPasswordSchema,
  resetPasswordSchema,
  changePasswordSchema,
} from './auth.schema'

const router = Router()

router.post('/register', validate(registerSchema), authController.register)
router.post('/verify-email', authController.verifyEmail)
router.post('/login', validate(loginSchema), authController.login)
router.post('/refresh', authController.refresh)
router.post('/forgot-password', validate(forgotPasswordSchema), authController.forgotPassword)
router.post('/reset-password', validate(resetPasswordSchema), authController.resetPassword)
router.post('/change-password', authenticate, validate(changePasswordSchema), authController.changePassword)
router.post('/logout', authenticate, authController.logout)

export default router