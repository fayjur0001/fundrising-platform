import { Router } from 'express'
import { Role } from '@prisma/client'
import * as userController from './user.controller'
import { authenticate, authorize } from '../../middlewares/auth.middleware'
import { validate } from '../../middlewares/validate.middleware'
import { updateProfileSchema } from './user.schema'

const router = Router()

// All routes require authentication
router.use(authenticate)

// Own profile routes
router.get('/me', userController.getMe)
router.put('/me', validate(updateProfileSchema), userController.updateMe)

// Admin only routes
router.get('/', authorize(Role.ADMIN), userController.getAllUsers)
router.get('/:id', authorize(Role.ADMIN), userController.getUserById)
router.patch('/:id/ban', authorize(Role.ADMIN), userController.banUser)
router.patch('/:id/unban', authorize(Role.ADMIN), userController.unbanUser)
router.delete('/:id', authorize(Role.ADMIN), userController.deleteUser)

export default router