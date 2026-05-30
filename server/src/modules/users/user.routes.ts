// server/src/modules/users/user.routes.ts
import { Router } from 'express'
import { Role } from '../../types/prisma-enums'
import * as userController from './user.controller'
import { authenticate, authorize } from '../../middlewares/auth.middleware'
import { validate } from '../../middlewares/validate.middleware'
import { updateProfileSchema } from './user.schema'
import { uploadSingle } from '../../middlewares/upload.middleware'

const router = Router()

// All routes require authentication
router.use(authenticate)

// Own profile routes
router.get('/me', userController.getMe)
router.put('/me', validate(updateProfileSchema), userController.updateMe)

// ── NEW: Avatar upload ──────────────────────────────────────────────────
// PATCH /users/avatar  — multipart/form-data, field name: "image"
router.patch('/avatar', uploadSingle, userController.uploadAvatar)

// Admin only routes
router.get('/', authorize(Role.ADMIN), userController.getAllUsers)
router.get('/:id', authorize(Role.ADMIN), userController.getUserById)
router.patch('/:id/ban', authorize(Role.ADMIN), userController.banUser)
router.patch('/:id/unban', authorize(Role.ADMIN), userController.unbanUser)
router.delete('/:id', authorize(Role.ADMIN), userController.deleteUser)

export default router