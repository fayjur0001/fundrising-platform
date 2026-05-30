'use client'

// src/lib/AuthContext.tsx
// Logged-in user কে সারা app-এ share করার জন্য React Context।
// AuthProvider এই context populate করে — Navbar, MobileMenu সহ
// যেকোনো client component useAuth() দিয়ে user পড়তে পারবে।

import { createContext, useContext } from 'react'
import type { UserProfile } from '@/lib/api'

export interface AuthContextValue {
  user: UserProfile | null   // null = not logged in / still loading
  ready: boolean             // false = silent refresh চলছে
  logout: () => Promise<void>
}

export const AuthContext = createContext<AuthContextValue>({
  user: null,
  ready: false,
  logout: async () => {},
})

export function useAuth(): AuthContextValue {
  return useContext(AuthContext)
}