// src/app/(dashboard)/dashboard/admin/page.tsx
'use client'

import { useEffect, useState } from 'react'
import DashboardLayout from '@/components/layout/DashboardLayout'
import PageHeader from '@/components/common/PageHeader'
import DonationTrendChart from '@/components/charts/DonationTrendChart'
import Link from 'next/link'
import { Users, Target, Receipt, TrendingUp } from 'lucide-react'
import { api } from '@/lib/api'
import { formatBDT } from '@/lib/utils'

const roleColors: Record<string, string> = {
  ADMIN:   'bg-red-100 text-red-700',
  CREATOR: 'bg-emerald-100 text-emerald-700',
  DONOR:   'bg-blue-100 text-blue-700',
}

const statusColors: Record<string, string> = {
  ACTIVE:    'bg-emerald-100 text-emerald-700',
  DRAFT:     'bg-gray-100 text-gray-600',
  PAUSED:    'bg-amber-100 text-amber-700',
  COMPLETED: 'bg-blue-100 text-blue-700',
  SUSPENDED: 'bg-red-100 text-red-700',
}

const avatarColors = [
  'bg-emerald-500', 'bg-violet-500', 'bg-blue-500',
  'bg-amber-500',   'bg-rose-500',   'bg-teal-500',
]

export default function AdminDashboardPage() {
  const [stats,           setStats]           = useState<any>(null)
  const [recentUsers,     setRecentUsers]     = useState<any[]>([])
  const [recentCampaigns, setRecentCampaigns] = useState<any[]>([])
  const [trendData,       setTrendData]       = useState<any[]>([])
  const [isLoading,       setIsLoading]       = useState(true)

  useEffect(() => {
    Promise.all([
      api.get<any>('/analytics/platform'),
      api.get<any>('/analytics/platform/trend?days=30'),
      api.get<any>('/users?limit=5&sort=newest'),
      api.get<any>('/campaigns/admin/all?limit=5&sort=newest'),
    ]).then(([statsRes, trendRes, usersRes, campaignsRes]) => {
      if (statsRes.success)     setStats(statsRes.data)
      if (trendRes.success)     setTrendData(trendRes.data)
      if (usersRes.success)     setRecentUsers(usersRes.data)
      if (campaignsRes.success) setRecentCampaigns(campaignsRes.data)
    }).catch(() => {}).finally(() => setIsLoading(false))
  }, [])

  const statCards = [
    {
      label: 'Total Users',
      value: stats?.users?.total ?? '—',
      icon: Users,
      color: 'text-blue-600',
      bg: 'bg-blue-50',
      href: '/admin/users',
    },
    {
      label: 'Total Campaigns',
      value: stats?.campaigns?.total ?? '—',
      icon: Target,
      color: 'text-emerald-600',
      bg: 'bg-emerald-50',
      href: '/admin/campaigns',
    },
    {
      label: 'Total Donations',
      value: stats?.donations?.total ?? '—',
      icon: Receipt,
      color: 'text-violet-600',
      bg: 'bg-violet-50',
      href: '/admin/donations',
    },
    {
      label: 'Total Raised',
      value: stats ? formatBDT(stats.donations.totalAmountRaised) : '—',
      icon: TrendingUp,
      color: 'text-amber-600',
      bg: 'bg-amber-50',
      href: '/admin/analytics',
    },
  ]

  return (
    <DashboardLayout role="admin">
      <PageHeader title="Admin Overview" />

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4 mb-8">
        {statCards.map((stat) => (
          <Link
            key={stat.label}
            href={stat.href}
            className="bg-white rounded-xl border border-gray-200 shadow-sm p-5 flex items-center gap-4 hover:shadow-md transition-shadow"
          >
            <div className={`w-11 h-11 rounded-xl ${stat.bg} flex items-center justify-center shrink-0`}>
              <stat.icon className={`w-5 h-5 ${stat.color}`} />
            </div>
            <div>
              <p className="text-sm text-slate-500">{stat.label}</p>
              <p className="text-xl font-bold text-slate-900 mt-0.5">
                {isLoading ? '…' : stat.value}
              </p>
            </div>
          </Link>
        ))}
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6 mb-8">
        {/* Recent Users */}
        <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between">
            <h2 className="text-base font-semibold text-slate-900">Recent Users</h2>
            <Link href="/admin/users" className="text-xs text-emerald-600 hover:text-emerald-700 font-medium">
              View all
            </Link>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-gray-50 border-b border-gray-100">
                  <th className="px-4 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wide">User</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wide hidden md:table-cell">Email</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wide">Role</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wide hidden lg:table-cell">Joined</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {recentUsers.map((u, idx) => {
                  const initials = u.name.split(' ').map((n: string) => n[0]).join('').slice(0, 2).toUpperCase()
                  const avatarBg = avatarColors[idx % avatarColors.length]
                  return (
                    <tr key={u.id} className="hover:bg-gray-50 transition-colors">
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-2.5">
                          <div className={`w-8 h-8 rounded-full ${avatarBg} flex items-center justify-center shrink-0`}>
                            <span className="text-xs font-bold text-white">{initials}</span>
                          </div>
                          <div>
                            <p className="font-medium text-slate-800 whitespace-nowrap">{u.name}</p>
                            {u.isBanned && (
                              <span className="text-[10px] text-red-500 font-medium">Banned</span>
                            )}
                          </div>
                        </div>
                      </td>
                      <td className="px-4 py-3 text-slate-500 hidden md:table-cell text-xs">{u.email}</td>
                      <td className="px-4 py-3">
                        <span className={`inline-block px-2 py-0.5 rounded-full text-xs font-medium capitalize ${roleColors[u.role] ?? 'bg-gray-100 text-gray-600'}`}>
                          {u.role.toLowerCase()}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-slate-400 text-xs hidden lg:table-cell whitespace-nowrap">
                        {new Date(u.createdAt).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' })}
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
        </div>

        {/* Recent Campaigns */}
        <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between">
            <h2 className="text-base font-semibold text-slate-900">Recent Campaigns</h2>
            <Link href="/admin/campaigns" className="text-xs text-emerald-600 hover:text-emerald-700 font-medium">
              View all
            </Link>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-gray-50 border-b border-gray-100">
                  <th className="px-4 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wide">Campaign</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wide hidden md:table-cell">Creator</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wide">Status</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wide hidden lg:table-cell">Raised</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {recentCampaigns.map((c) => (
                  <tr key={c.id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-4 py-3">
                      <p className="font-medium text-slate-800 truncate max-w-[150px]" title={c.title}>{c.title}</p>
                      <p className="text-xs text-slate-400 mt-0.5">{c.category}</p>
                    </td>
                    <td className="px-4 py-3 text-slate-500 text-xs hidden md:table-cell whitespace-nowrap">
                      {c.creator?.name ?? '—'}
                    </td>
                    <td className="px-4 py-3">
                      <span className={`inline-block px-2 py-0.5 rounded-full text-xs font-medium capitalize ${statusColors[c.status] ?? 'bg-gray-100 text-gray-600'}`}>
                        {c.status.toLowerCase()}
                      </span>
                    </td>
                    <td className="px-4 py-3 font-semibold text-emerald-600 text-sm hidden lg:table-cell whitespace-nowrap">
                      {formatBDT(c.raisedAmount)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Donation Trend Chart */}
      <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6">
        <h2 className="text-base font-semibold text-slate-900 mb-4">Donation Trend (Last 30 Days)</h2>
        <DonationTrendChart donations={trendData} days={30} />
      </div>
    </DashboardLayout>
  )
}