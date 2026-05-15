// src/components/auth/RegisterForm.tsx
'use client'

import React, { useState } from 'react'
import Link from 'next/link'
import { Eye, EyeOff, Heart, Megaphone } from 'lucide-react'
import Input from '@/components/ui/input'
import Button from '@/components/ui/button'

type Role = 'donor' | 'creator'

function getPasswordStrength(password: string): { label: string; color: string; width: string } {
  if (password.length === 0) return { label: '', color: '', width: 'w-0' }
  const hasNumber = /\d/.test(password)
  const hasSpecial = /[^a-zA-Z0-9]/.test(password)
  if (password.length > 10 && hasSpecial) return { label: 'Strong', color: 'bg-emerald-500', width: 'w-full' }
  if (password.length >= 6 && hasNumber) return { label: 'Fair', color: 'bg-amber-500', width: 'w-2/3' }
  return { label: 'Weak', color: 'bg-red-500', width: 'w-1/3' }
}

export default function RegisterForm() {
  const [role, setRole] = useState<Role>('donor')
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirm, setShowConfirm] = useState(false)
  const [isLoading, setIsLoading] = useState(false)

  const strength = getPasswordStrength(password)

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (password !== confirmPassword) return
    setIsLoading(true)
    await new Promise((res) => setTimeout(res, 1000))
    console.log('Register:', { role, name, email, password })
    setIsLoading(false)
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      {/* Role selection */}
      <div>
        <p className="text-sm font-medium text-slate-700 mb-2">I want to</p>
        <div className="grid grid-cols-2 gap-3">
          {([
            { value: 'donor', label: 'Donor', icon: Heart, desc: 'Support campaigns' },
            { value: 'creator', label: 'Campaign Creator', icon: Megaphone, desc: 'Start a campaign' },
          ] as const).map(({ value, label, icon: Icon, desc }) => (
            <button
              key={value}
              type="button"
              onClick={() => setRole(value)}
              className={`flex flex-col items-center gap-2 p-4 rounded-xl border-2 transition-all text-center ${
                role === value
                  ? 'border-emerald-600 bg-emerald-50 text-emerald-700'
                  : 'border-gray-200 text-slate-600 hover:border-gray-300 hover:bg-gray-50'
              }`}
            >
              <Icon size={22} />
              <div>
                <p className="text-sm font-semibold">{label}</p>
                <p className="text-xs text-slate-400">{desc}</p>
              </div>
            </button>
          ))}
        </div>
      </div>

      <Input label="Full Name" placeholder="Fatema Begum" value={name} onChange={(e) => setName(e.target.value)} required />
      <Input label="Email" type="email" placeholder="you@example.com" value={email} onChange={(e) => setEmail(e.target.value)} required />

      {/* Password */}
      <div className="flex flex-col gap-1">
        <label className="text-sm font-medium text-slate-700">Password</label>
        <div className="relative">
          <input
            type={showPassword ? 'text' : 'password'}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="••••••••"
            required
            className="border border-gray-200 rounded-lg px-3 py-2 w-full text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-500 pr-10"
          />
          <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600">
            {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
          </button>
        </div>
        {password.length > 0 && (
          <div className="mt-1.5 space-y-1">
            <div className="h-1.5 w-full bg-gray-100 rounded-full overflow-hidden">
              <div className={`h-full rounded-full transition-all duration-300 ${strength.color} ${strength.width}`} />
            </div>
            <p className={`text-xs font-medium ${strength.color.replace('bg-', 'text-')}`}>{strength.label}</p>
          </div>
        )}
      </div>

      {/* Confirm password */}
      <div className="flex flex-col gap-1">
        <label className="text-sm font-medium text-slate-700">Confirm Password</label>
        <div className="relative">
          <input
            type={showConfirm ? 'text' : 'password'}
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            placeholder="••••••••"
            required
            className={`border rounded-lg px-3 py-2 w-full text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-500 pr-10 ${
              confirmPassword && confirmPassword !== password ? 'border-red-400' : 'border-gray-200'
            }`}
          />
          <button type="button" onClick={() => setShowConfirm(!showConfirm)} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600">
            {showConfirm ? <EyeOff size={16} /> : <Eye size={16} />}
          </button>
        </div>
        {confirmPassword && confirmPassword !== password && (
          <p className="text-xs text-red-600">Passwords do not match</p>
        )}
      </div>

      <Button type="submit" variant="primary" size="md" isLoading={isLoading} className="w-full">
        Create Account
      </Button>

      <p className="text-center text-sm text-slate-500">
        Already have an account?{' '}
        <Link href="/auth/login" className="text-emerald-600 hover:text-emerald-700 font-medium">
          Login
        </Link>
      </p>
    </form>
  )
}