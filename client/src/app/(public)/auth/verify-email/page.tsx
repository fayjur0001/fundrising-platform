// src/app/(public)/auth/verify-email/page.tsx
'use client'

import { useEffect, useState } from 'react'
import VerifyEmailCard from '@/components/auth/VerifyEmailCard'

type VerifyStatus = 'loading' | 'success' | 'error'

export default function VerifyEmailPage() {
  const [status, setStatus] = useState<VerifyStatus>('loading')

  useEffect(() => {
    const timer = setTimeout(() => setStatus('success'), 2000)
    return () => clearTimeout(timer)
  }, [])

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-md">
        <VerifyEmailCard status={status} />

        <div className="mt-6 flex items-center justify-center gap-2">
          <button
            onClick={() => setStatus('success')}
            className={`px-3 py-1.5 rounded-lg text-xs font-medium border transition-colors ${
              status === 'success'
                ? 'bg-emerald-600 text-white border-emerald-600'
                : 'bg-white text-slate-600 border-gray-200 hover:border-emerald-300 hover:text-emerald-600'
            }`}
          >
            Simulate Success
          </button>
          <button
            onClick={() => setStatus('error')}
            className={`px-3 py-1.5 rounded-lg text-xs font-medium border transition-colors ${
              status === 'error'
                ? 'bg-red-500 text-white border-red-500'
                : 'bg-white text-slate-600 border-gray-200 hover:border-red-300 hover:text-red-500'
            }`}
          >
            Simulate Error
          </button>
          <button
            onClick={() => setStatus('loading')}
            className={`px-3 py-1.5 rounded-lg text-xs font-medium border transition-colors ${
              status === 'loading'
                ? 'bg-amber-500 text-white border-amber-500'
                : 'bg-white text-slate-600 border-gray-200 hover:border-amber-300 hover:text-amber-500'
            }`}
          >
            Simulate Loading
          </button>
        </div>
      </div>
    </div>
  )
}