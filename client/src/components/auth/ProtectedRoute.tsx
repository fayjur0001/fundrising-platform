// src/components/auth/ProtectedRoute.tsx
'use client'

import React, { ReactNode, useState } from 'react'
import Link from 'next/link'
import { ShieldX, LogIn } from 'lucide-react'
import Button from '@/components/ui/button'

interface ProtectedRouteProps {
  children: ReactNode
  allowedRoles?: ('donor' | 'creator' | 'admin')[]
}

export default function ProtectedRoute({ children, allowedRoles }: ProtectedRouteProps) {
  // Mock auth state — no localStorage
  const [mockRole] = useState<'donor' | 'creator' | 'admin' | null>(null)

  if (!mockRole) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] px-4 text-center gap-4">
        <div className="w-16 h-16 rounded-full bg-gray-100 flex items-center justify-center">
          <LogIn size={28} className="text-slate-400" />
        </div>
        <div>
          <h3 className="text-base font-semibold text-slate-900 mb-1">Authentication Required</h3>
          <p className="text-sm text-slate-500">Please sign in to access this page.</p>
        </div>
        <Link href="/auth/login">
          <Button variant="primary" size="md">Sign In</Button>
        </Link>
      </div>
    )
  }

  if (allowedRoles && !allowedRoles.includes(mockRole)) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] px-4 text-center gap-4">
        <div className="w-16 h-16 rounded-full bg-red-50 flex items-center justify-center">
          <ShieldX size={28} className="text-red-500" />
        </div>
        <div>
          <h3 className="text-base font-semibold text-slate-900 mb-1">Access Denied</h3>
          <p className="text-sm text-slate-500">
            You don&apos;t have permission to view this page.
          </p>
        </div>
        <Link href="/">
          <Button variant="outline" size="md">Go Home</Button>
        </Link>
      </div>
    )
  }

  return <>{children}</>
}