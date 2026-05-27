import { Request, Response, NextFunction } from 'express'
import * as authService from './auth.service'
import { sendSuccess, sendError } from '@/utils/response'
import { env } from '@/config/env'

const asyncHandler = (fn: (req: Request, res: Response, next: NextFunction) => Promise<void>) =>
  (req: Request, res: Response, next: NextFunction) =>
    Promise.resolve(fn(req, res, next)).catch(next)

const REFRESH_COOKIE_OPTIONS = {
  httpOnly: true,
  secure: env.NODE_ENV === 'production',
  sameSite: 'lax' as const,
  maxAge: 30 * 24 * 60 * 60 * 1000,
}

export const register = asyncHandler(async (req, res) => {
  const user = await authService.register(req.body)
  sendSuccess(
    res,
    user,
    'Registration successful! Please check your email to verify your account.',
    201
  )
})

export const verifyEmail = asyncHandler(async (req, res) => {
  const { token } = req.body
  const result = await authService.verifyEmail(token)
  sendSuccess(res, null, result.message)
})

export const login = asyncHandler(async (req, res) => {
  const { user, accessToken, refreshToken } = await authService.login(req.body)

  res.cookie('refreshToken', refreshToken, REFRESH_COOKIE_OPTIONS)

  sendSuccess(res, { user, accessToken }, 'Login successful')
})

export const refresh = asyncHandler(async (req, res) => {
  const token = req.cookies?.refreshToken as string | undefined

  if (!token) {
    sendError(res, 'Refresh token not found', 401)
    return
  }

  const result = await authService.refreshToken(token)
  sendSuccess(res, result, 'Token refreshed')
})

export const forgotPassword = asyncHandler(async (req, res) => {
  const result = await authService.forgotPassword(req.body.email)
  sendSuccess(res, null, result.message)
})

export const resetPassword = asyncHandler(async (req, res) => {
  const { token, password } = req.body
  const result = await authService.resetPassword(token, password)
  sendSuccess(res, null, result.message)
})

export const changePassword = asyncHandler(async (req, res) => {
  const { currentPassword, newPassword } = req.body
  const result = await authService.changePassword(
    req.user!.id,
    currentPassword,
    newPassword
  )
  sendSuccess(res, null, result.message)
})

export const logout = asyncHandler(async (req, res) => {
  res.clearCookie('refreshToken', {
    httpOnly: true,
    secure: env.NODE_ENV === 'production',
    sameSite: 'lax',
  })
  sendSuccess(res, null, 'Logged out successfully')
})