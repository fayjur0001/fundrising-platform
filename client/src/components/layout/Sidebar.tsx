// src/components/layout/Sidebar.tsx
'use client'

import React from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import {
  Heart,
  LayoutDashboard,
  Megaphone,
  HandCoins,
  BarChart2,
  Settings,
  BookOpen,
  Users,
  FileText,
  TrendingUp,
} from 'lucide-react'

interface SidebarProps {
  role: 'creator' | 'donor' | 'admin'
}

type NavItem = {
  label: string
  href: string
  icon: React.ElementType
}

const creatorNav: NavItem[] = [
  { label: 'Overview',     href: '/dashboard/creator', icon: LayoutDashboard },
  { label: 'My Campaigns', href: '/creator/campaigns',  icon: Megaphone },
  { label: 'Donations',    href: '/creator/donations',  icon: HandCoins },
  { label: 'Analytics',    href: '/creator/analytics',  icon: BarChart2 },
  { label: 'Settings',     href: '/creator/settings',   icon: Settings },
]

const donorNav: NavItem[] = [
  { label: 'Overview',            href: '/dashboard/donor',           icon: LayoutDashboard },
  { label: 'My Donations',        href: '/donor/donations',           icon: HandCoins },
  { label: 'Supported Campaigns', href: '/donor/supported-campaigns', icon: BookOpen },
  { label: 'Settings',            href: '/donor/settings',            icon: Settings },
]

const adminNav: NavItem[] = [
  { label: 'Overview',  href: '/dashboard/admin',  icon: LayoutDashboard },
  { label: 'Users',     href: '/admin/users',       icon: Users },
  { label: 'Campaigns', href: '/admin/campaigns',   icon: Megaphone },
  { label: 'Donations', href: '/admin/donations',   icon: HandCoins },
  { label: 'Reports',   href: '/admin/reports',     icon: FileText },
  { label: 'Analytics', href: '/admin/analytics',   icon: TrendingUp },
  { label: 'Settings',  href: '/admin/settings',    icon: Settings },
]

const navMap = { creator: creatorNav, donor: donorNav, admin: adminNav }

const userMap = {
  creator: { name: 'Fatema Begum',     role: 'Creator', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Fatema' },
  donor:   { name: 'Nusrat Jahan',     role: 'Donor',   avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Nusrat' },
  admin:   { name: 'Rahim Uddin Ahmed', role: 'Admin',  avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Rahim' },
}

export default function Sidebar({ role }: SidebarProps) {
  const pathname = usePathname()
  const navItems = navMap[role]
  const user = userMap[role]

  return (
    <aside className="w-60 h-full flex flex-col border-r border-gray-200 bg-white">
      {/* Logo */}
      <div className="flex items-center gap-2 px-5 py-5 border-b border-gray-100">
        <Heart size={20} className="text-emerald-600 fill-emerald-600" />
        <span className="text-lg font-bold text-emerald-600">FundRaise</span>
      </div>

      {/* Nav */}
      <nav className="flex-1 px-3 py-4 space-y-0.5 overflow-y-auto">
        {navItems.map((item) => {
          const Icon = item.icon
          const isActive =
            pathname === item.href ||
            (item.href !== '/dashboard/creator' &&
             item.href !== '/dashboard/donor' &&
             item.href !== '/dashboard/admin' &&
             pathname.startsWith(item.href + '/'))
          const exactActive = pathname === item.href

          const active = isActive || exactActive

          return (
            <Link
              key={item.href}
              href={item.href}
              className={`
                flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium
                border-l-2 transition-colors
                ${active
                  ? 'bg-emerald-50 text-emerald-600 border-emerald-600'
                  : 'text-slate-600 hover:bg-gray-50 border-transparent hover:text-slate-900'}
              `}
            >
              <Icon size={18} />
              {item.label}
            </Link>
          )
        })}
      </nav>

      {/* User info */}
      <div className="px-4 py-4 border-t border-gray-100">
        <div className="flex items-center gap-3">
          <img
            src={user.avatar}
            alt={user.name}
            className="w-9 h-9 rounded-full bg-gray-100 border border-gray-200 flex-shrink-0"
          />
          <div className="min-w-0">
            <p className="text-sm font-medium text-slate-900 truncate">{user.name}</p>
            <p className="text-xs text-slate-400">{user.role}</p>
          </div>
        </div>
      </div>
    </aside>
  )
}