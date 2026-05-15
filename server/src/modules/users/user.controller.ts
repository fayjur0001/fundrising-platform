import { Request, Response, NextFunction } from 'express'
import * as userService from './user.service'
import { sendSuccess, sendPaginated } from '../../utils/response'

const asyncHandler = (fn: (req: Request, res: Response, next: NextFunction) => Promise<void>) =>
  (req: Request, res: Response, next: NextFunction) =>
    Promise.resolve(fn(req, res, next)).catch(next)

export const getMe = asyncHandler(async (req, res) => {
  const user = await userService.getProfile(req.user!.id)
  sendSuccess(res, user, 'Profile fetched successfully')
})

export const updateMe = asyncHandler(async (req, res) => {
  const user = await userService.updateProfile(req.user!.id, req.body)
  sendSuccess(res, user, 'Profile updated successfully')
})

export const getAllUsers = asyncHandler(async (req, res) => {
  const { users, meta } = await userService.getAllUsers(req.query)
  sendPaginated(res, users, meta, 'Users fetched successfully')
})

export const getUserById = asyncHandler(async (req, res) => {
  const user = await userService.getUserById(req.params.id)
  sendSuccess(res, user, 'User fetched successfully')
})

export const banUser = asyncHandler(async (req, res) => {
  const user = await userService.banUser(req.params.id, req.user!.id)
  sendSuccess(res, user, 'User banned successfully')
})

export const unbanUser = asyncHandler(async (req, res) => {
  const user = await userService.unbanUser(req.params.id)
  sendSuccess(res, user, 'User unbanned successfully')
})

export const deleteUser = asyncHandler(async (req, res) => {
  const result = await userService.deleteUser(req.params.id, req.user!.id)
  sendSuccess(res, null, result.message)
})