'use client'

import React, { useState } from 'react'
import Link from 'next/link'
import { Eye, EyeOff } from 'lucide-react'
import Input from '@/components/ui/input'
import Button from '@/components/ui/button'
import { authApi } from '@/lib/api'

export default function LoginForm() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [rememberMe, setRememberMe] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState('')

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setIsLoading(true)
    setError('')

    try {
      const data = await authApi.login(email, password)

      if (data.success) {
        // accessToken already stored in memory by authApi.login()
        const { user } = data.data
        sessionStorage.setItem('user', JSON.stringify(user))

        const role = user.role.toLowerCase()
        if (role === 'admin') window.location.href = '/dashboard/admin'
        else if (role === 'creator') window.location.href = '/dashboard/creator'
        else window.location.href = '/dashboard/donor'
      } else {
        setError(data.message || 'Login failed. Please try again.')
      }
    } catch (err) {
      setError('Something went wrong. Please try again.')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      <Input
        label="Email"
        type="email"
        placeholder="you@example.com"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        required
      />

      <div className="flex flex-col gap-1">
        <label className="text-sm font-medium text-slate-700">Password</label>
        <div className="relative">
          <input
            type={showPassword ? 'text' : 'password'}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="••••••••"
            required
            className="border border-gray-200 rounded-lg px-3 py-2 w-full text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent pr-10"
          />
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 transition-colors"
          >
            {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
          </button>
        </div>
      </div>

      {error && (
        <p className="text-sm text-red-600 bg-red-50 border border-red-200 rounded-lg px-3 py-2">
          {error}
        </p>
      )}

      <div className="flex items-center justify-between">
        <label className="flex items-center gap-2 cursor-pointer">
          <input
            type="checkbox"
            checked={rememberMe}
            onChange={(e) => setRememberMe(e.target.checked)}
            className="rounded border-gray-300 text-emerald-600 focus:ring-emerald-500"
          />
          <span className="text-sm text-slate-600">Remember me</span>
        </label>
        <Link href="/auth/forgot-password" className="text-sm text-emerald-600 hover:text-emerald-700 font-medium">
          Forgot password?
        </Link>
      </div>

      <Button type="submit" variant="primary" size="md" isLoading={isLoading} className="w-full">
        Sign In
      </Button>

      <p className="text-center text-sm text-slate-500">
        Don&apos;t have an account?{' '}
        <Link href="/auth/register" className="text-emerald-600 hover:text-emerald-700 font-medium">
          Register
        </Link>
      </p>
    </form>
  )
}