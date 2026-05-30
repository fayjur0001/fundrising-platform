// src/components/auth/ProtectedRoute.tsx
'use client'

import React, { ReactNode, useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { ShieldX, LogIn } from 'lucide-react'
import Button from '@/components/ui/button'
import { userApi, UserProfile } from '@/lib/api'

interface ProtectedRouteProps {
  children: ReactNode
  allowedRoles?: ('donor' | 'creator' | 'admin')[]
}

export default function ProtectedRoute({ children, allowedRoles }: ProtectedRouteProps) {
  const router = useRouter()
  const [user, setUser] = useState<UserProfile | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // sessionStorage-এর পরিবর্তে সরাসরি API দিয়ে real user fetch করা হচ্ছে।
    // AuthProvider আগেই /auth/refresh call করেছে, তাই accessToken memory-তে আছে।
    // Token না থাকলে api.ts নিজেই /auth/refresh retry করে — তারপরও fail
    // করলে clearAccessToken() + redirect হয়।
    userApi.getMe()
      .then((res) => {
        if (res.success) {
          setUser(res.data)
        } else {
          setUser(null)
        }
      })
      .catch(() => {
        // 401 হলে api.ts নিজেই login-এ redirect করে।
        // অন্য error হলে unauthenticated UI দেখাও।
        setUser(null)
      })
      .finally(() => {
        setLoading(false)
      })
  }, [])

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="w-6 h-6 border-2 border-emerald-500 border-t-transparent rounded-full animate-spin" />
      </div>
    )
  }

  if (!user) {
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

  const userRole = user.role.toLowerCase() as 'donor' | 'creator' | 'admin'

  if (allowedRoles && !allowedRoles.includes(userRole)) {
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