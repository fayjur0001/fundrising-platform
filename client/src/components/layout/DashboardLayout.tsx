// src/components/layout/DashboardLayout.tsx
'use client'

import React, { useState } from 'react'
import { usePathname } from 'next/navigation'
import { Menu, ChevronRight, LogOut, User } from 'lucide-react'
import Sidebar from './Sidebar'
import NotificationBell from '@/components/notification/NotificationBell'
import Dropdown from '@/components/ui/dropdown'

interface DashboardLayoutProps {
  children: React.ReactNode
  role: 'creator' | 'donor' | 'admin'
}

const userMap = {
  creator: { name: 'Fatema Begum',      avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Fatema' },
  donor:   { name: 'Nusrat Jahan',      avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Nusrat' },
  admin:   { name: 'Rahim Uddin Ahmed', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Rahim' },
}

function buildBreadcrumbs(pathname: string): string[] {
  const segments = pathname.split('/').filter(Boolean)
  return segments.map((seg) =>
    seg.replace(/-/g, ' ').replace(/\b\w/g, (c) => c.toUpperCase())
  )
}

export default function DashboardLayout({ children, role }: DashboardLayoutProps) {
  const pathname = usePathname()
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const user = userMap[role]
  const breadcrumbs = buildBreadcrumbs(pathname)

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
              <NotificationBell userId={role === 'creator' ? 'user-002' : role === 'donor' ? 'user-004' : 'user-001'} />
              <Dropdown
                trigger={
                  <img
                    src={user.avatar}
                    alt={user.name}
                    className="w-9 h-9 rounded-full bg-gray-100 border border-gray-200 cursor-pointer hover:ring-2 hover:ring-emerald-500 transition-all"
                  />
                }
                items={[
                  { label: 'Profile', value: 'profile', onClick: () => {} },
                  { label: 'Logout', value: 'logout', danger: true, onClick: () => {} },
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