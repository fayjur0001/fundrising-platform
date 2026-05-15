// src/components/auth/VerifyEmailCard.tsx
'use client'

import React, { useState } from 'react'
import Link from 'next/link'
import { CheckCircle, XCircle } from 'lucide-react'
import Loader from '@/components/ui/loader'
import Button from '@/components/ui/button'

interface VerifyEmailCardProps {
  status: 'success' | 'error' | 'loading'
}

export default function VerifyEmailCard({ status }: VerifyEmailCardProps) {
  const [resent, setResent] = useState(false)
  const [isResending, setIsResending] = useState(false)

  async function handleResend() {
    setIsResending(true)
    await new Promise((res) => setTimeout(res, 1000))
    console.log('Resend verification email')
    setResent(true)
    setIsResending(false)
  }

  if (status === 'loading') {
    return (
      <div className="flex flex-col items-center text-center gap-4 py-8">
        <Loader size="lg" />
        <p className="text-sm text-slate-500 font-medium">Verifying your email...</p>
      </div>
    )
  }

  if (status === 'success') {
    return (
      <div className="flex flex-col items-center text-center gap-4 py-4">
        <div className="w-16 h-16 rounded-full bg-emerald-50 flex items-center justify-center">
          <CheckCircle size={32} className="text-emerald-600" />
        </div>
        <div>
          <h3 className="text-lg font-semibold text-slate-900 mb-1">Email Verified!</h3>
          <p className="text-sm text-slate-500">Your email has been verified successfully.</p>
        </div>
        <Link href="/auth/login">
          <Button variant="primary" size="md">Go to Login</Button>
        </Link>
      </div>
    )
  }

  return (
    <div className="flex flex-col items-center text-center gap-4 py-4">
      <div className="w-16 h-16 rounded-full bg-red-50 flex items-center justify-center">
        <XCircle size={32} className="text-red-500" />
      </div>
      <div>
        <h3 className="text-lg font-semibold text-slate-900 mb-1">Verification Failed</h3>
        <p className="text-sm text-slate-500">
          {resent
            ? 'A new verification link has been sent to your email.'
            : 'The verification link is invalid or has expired.'}
        </p>
      </div>
      {!resent && (
        <Button variant="primary" size="md" isLoading={isResending} onClick={handleResend}>
          Resend Email
        </Button>
      )}
      <Link href="/auth/login" className="text-sm text-emerald-600 hover:text-emerald-700 font-medium">
        ← Back to Login
      </Link>
    </div>
  )
}