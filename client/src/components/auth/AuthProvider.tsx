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
import { setAccessToken, clearAccessToken } from '@/lib/auth-store'

const BASE_URL = process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:5000/api/v1'

// authApi import না করে সরাসরি fetch করা হচ্ছে — circular dependency এড়াতে
async function silentRefresh(): Promise<void> {
  try {
    const response = await fetch(`${BASE_URL}/auth/refresh`, {
      method: 'POST',
      credentials: 'include',
    })
    if (!response.ok) {
      clearAccessToken()
      return
    }
    const data = await response.json()
    if (data?.data?.accessToken) {
      setAccessToken(data.data.accessToken)
    }
  } catch {
    clearAccessToken()
  }
}

interface AuthProviderProps {
  children: React.ReactNode
}

export default function AuthProvider({ children }: AuthProviderProps) {
  const [ready, setReady] = useState(false)

  useEffect(() => {
    // App mount হলেই silent refresh — cookie থাকলে নতুন accessToken পাবে,
    // না থাকলে null return করবে (লগিন করা নেই, এটা স্বাভাবিক)
    silentRefresh().finally(() => {
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