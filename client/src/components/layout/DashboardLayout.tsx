// src/components/layout/DashboardLayout.tsx
'use client'

import React, { useEffect, useState } from 'react'
import { usePathname, useRouter } from 'next/navigation'
import { Menu, ChevronRight, LogOut, User } from 'lucide-react'
import Sidebar from './Sidebar'
import NotificationBell from '@/components/notification/NotificationBell'
import Dropdown from '@/components/ui/dropdown'
import { authApi } from '@/lib/api'

interface DashboardLayoutProps {
  children: React.ReactNode
  role: 'creator' | 'donor' | 'admin'
}

interface StoredUser {
  id: string
  name: string
  email: string
  role: string
  avatar: string | null
}

function buildBreadcrumbs(pathname: string): string[] {
  const segments = pathname.split('/').filter(Boolean)
  return segments.map((seg) =>
    seg.replace(/-/g, ' ').replace(/\b\w/g, (c) => c.toUpperCase())
  )
}

function getInitials(name: string): string {
  return name
    .split(' ')
    .map((n) => n[0])
    .slice(0, 2)
    .join('')
    .toUpperCase()
}

export default function DashboardLayout({ children, role }: DashboardLayoutProps) {
  const pathname = usePathname()
  const router = useRouter()
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [user, setUser] = useState<StoredUser | null>(null)
  const breadcrumbs = buildBreadcrumbs(pathname)

  useEffect(() => {
    try {
      const raw = sessionStorage.getItem('user')
      if (raw) setUser(JSON.parse(raw))
    } catch {
      // parse error — ignore, show fallback
    }
  }, [])

  const handleLogout = async () => {
    try {
      await authApi.logout()
    } finally {
      sessionStorage.removeItem('user')
      router.push('/auth/login')
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* Desktop sidebar */}
      <div className="hidden lg:flex flex-col fixed inset-y-0 left-0 w-60 z-30">
        <Sidebar role={role} />
      </div>

      {/* Mobile sidebar overlay */}
      {sidebarOpen && (
        <div className="lg:hidden fixed inset-0 z-40 flex">
          <div
            className="absolute inset-0 bg-black/50"
            onClick={() => setSidebarOpen(false)}
          />
          <div className="relative w-60 flex flex-col bg-white h-full z-50 shadow-xl">
            <Sidebar role={role} />
          </div>
        </div>
      )}

      {/* Main content */}
      <div className="flex-1 lg:ml-60 flex flex-col min-h-screen">
        {/* Top bar */}
        <header className="sticky top-0 z-20 bg-white border-b border-gray-200 shadow-sm">
          <div className="flex items-center justify-between px-4 sm:px-6 h-16">
            {/* Left: hamburger + breadcrumbs */}
            <div className="flex items-center gap-3">
              <button
                className="lg:hidden p-2 rounded-lg text-slate-600 hover:bg-gray-100 transition-colors"
                onClick={() => setSidebarOpen(true)}
              >
                <Menu size={20} />
              </button>
              <nav className="hidden sm:flex items-center gap-1 text-sm text-slate-500">
                {breadcrumbs.map((crumb, i) => (
                  <React.Fragment key={i}>
                    {i > 0 && <ChevronRight size={14} className="text-slate-300" />}
                    <span className={i === breadcrumbs.length - 1 ? 'text-slate-900 font-medium' : ''}>
                      {crumb}
                    </span>
                  </React.Fragment>
                ))}
              </nav>
            </div>

            {/* Right: notifications + avatar dropdown */}
            <div className="flex items-center gap-3">
              <NotificationBell userId={user?.id ?? ''} />
              <Dropdown
                trigger={
                  user?.avatar ? (
                    <img
                      src={user.avatar}
                      alt={user.name}
                      className="w-9 h-9 rounded-full bg-gray-100 border border-gray-200 cursor-pointer hover:ring-2 hover:ring-emerald-500 transition-all"
                    />
                  ) : (
                    <div className="w-9 h-9 rounded-full bg-emerald-100 border border-emerald-200 flex items-center justify-center cursor-pointer hover:ring-2 hover:ring-emerald-500 transition-all text-xs font-semibold text-emerald-700">
                      {user ? getInitials(user.name) : <User size={16} />}
                    </div>
                  )
                }
                items={[
                  {
                    label: user?.name ?? 'Profile',
                    value: 'profile',
                    onClick: () => router.push(`/${role}/settings`),
                  },
                  {
                    label: 'Logout',
                    value: 'logout',
                    danger: true,
                    onClick: handleLogout,
                  },
                ]}
                align="right"
              />
            </div>
          </div>
        </header>

        {/* Page content */}
        <main className="flex-1 p-4 sm:p-6">
          {children}
        </main>
      </div>
    </div>
  )
}