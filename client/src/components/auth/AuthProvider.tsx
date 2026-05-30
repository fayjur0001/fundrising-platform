'use client'

// src/components/auth/AuthProvider.tsx
//
// কেন এই file দরকার?
// ─────────────────────────────────────────────────────────────
// accessToken শুধু browser memory-তে থাকে (auth-store.ts)।
// Page refresh বা server restart দিলে token null হয়ে যায়।
//
// এখন কী হবে:
//   1. App load হওয়ার সাথে সাথে একবার silently /auth/refresh call হবে
//   2. Cookie থেকে নতুন accessToken নিয়ে memory-তে রাখবে
//   3. Token পাওয়া গেলে /users/me দিয়ে user profile fetch করবে
//   4. User + ready state AuthContext-এ রাখবে
//   5. Navbar সহ যেকোনো component useAuth() দিয়ে user পড়তে পারবে
// ─────────────────────────────────────────────────────────────

import { useEffect, useState, useCallback } from 'react'
import { setAccessToken, clearAccessToken } from '@/lib/auth-store'
import { AuthContext } from '@/lib/AuthContext'
import type { UserProfile } from '@/lib/api'

const BASE_URL = process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:5000/api/v1'

// authApi import না করে সরাসরি fetch করা হচ্ছে — circular dependency এড়াতে
async function silentRefresh(): Promise<string | null> {
  try {
    const response = await fetch(`${BASE_URL}/auth/refresh`, {
      method: 'POST',
      credentials: 'include',
    })
    if (!response.ok) {
      clearAccessToken()
      return null
    }
    const data = await response.json()
    const token: string | undefined = data?.data?.accessToken ?? data?.accessToken
    if (token) {
      setAccessToken(token)
      return token
    }
    return null
  } catch {
    clearAccessToken()
    return null
  }
}

async function fetchMe(token: string): Promise<UserProfile | null> {
  try {
    const response = await fetch(`${BASE_URL}/users/me`, {
      headers: { Authorization: `Bearer ${token}` },
      credentials: 'include',
    })
    if (!response.ok) return null
    const data = await response.json()
    return (data?.data as UserProfile) ?? null
  } catch {
    return null
  }
}

interface AuthProviderProps {
  children: React.ReactNode
}

export default function AuthProvider({ children }: AuthProviderProps) {
  const [user, setUser] = useState<UserProfile | null>(null)
  const [ready, setReady] = useState(false)

  // Logout — token clear + user null + server-side cookie মুছতে POST /auth/logout
  const logout = useCallback(async () => {
    try {
      await fetch(`${BASE_URL}/auth/logout`, {
        method: 'POST',
        credentials: 'include',
      })
    } catch {
      // best-effort
    }
    clearAccessToken()
    setUser(null)
    window.location.href = '/auth/login'
  }, [])

  useEffect(() => {
    // App mount হলেই silent refresh:
    //   - Cookie থাকলে → accessToken পাবে → user fetch করবে
    //   - Cookie না থাকলে → token null → user null (logged out)
    ;(async () => {
      const token = await silentRefresh()
      if (token) {
        const profile = await fetchMe(token)
        setUser(profile)
      }
      setReady(true)
    })()
  }, [])

  // Refresh শেষ হওয়ার আগে blank দেখাবে — flicker এড়াতে
  if (!ready) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="w-7 h-7 border-2 border-emerald-500 border-t-transparent rounded-full animate-spin" />
      </div>
    )
  }

  return (
    <AuthContext.Provider value={{ user, ready, logout }}>
      {children}
    </AuthContext.Provider>
  )
}