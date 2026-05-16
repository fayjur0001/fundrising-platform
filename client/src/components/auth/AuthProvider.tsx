'use client'

// src/components/auth/AuthProvider.tsx
//
// কেন এই file দরকার?
// ─────────────────────────────────────────────────────────────
// accessToken শুধু browser memory-তে থাকে (auth-store.ts)।
// Page refresh বা server restart দিলে token null হয়ে যায়।
//
// তখন যা হত (bug):
//   - প্রতিটা API call আগে 401 পেত
//   - তারপর api.ts retry করত /auth/refresh দিয়ে
//   - এই race condition-এ কখনো কাজ করত, কখনো করত না
//
// এখন কী হবে:
//   - App load হওয়ার সাথে সাথে একবার silently /auth/refresh call হবে
//   - Cookie থেকে নতুন accessToken নিয়ে memory-তে রাখবে
//   - তারপরেই children render হবে — কোনো race condition নেই
// ─────────────────────────────────────────────────────────────

import { useEffect, useState } from 'react'
import { authApi } from '@/lib/api'

interface AuthProviderProps {
  children: React.ReactNode
}

export default function AuthProvider({ children }: AuthProviderProps) {
  const [ready, setReady] = useState(false)

  useEffect(() => {
    // App mount হলেই silent refresh — cookie থাকলে নতুন accessToken পাবে,
    // না থাকলে null return করবে (লগিন করা নেই, এটা স্বাভাবিক)
    authApi.refreshToken().finally(() => {
      setReady(true)
    })
  }, [])

  // Refresh শেষ হওয়ার আগে blank দেখাবে — flicker এড়াতে
  if (!ready) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="w-7 h-7 border-2 border-emerald-500 border-t-transparent rounded-full animate-spin" />
      </div>
    )
  }

  return <>{children}</>
}