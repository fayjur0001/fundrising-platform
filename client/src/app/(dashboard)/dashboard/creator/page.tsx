// src/app/(dashboard)/dashboard/creator/page.tsx
'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { TrendingUp, Target, Users, FileText, BarChart2, Plus, Pencil } from 'lucide-react'
import DashboardLayout from '@/components/layout/DashboardLayout'
import PageHeader from '@/components/common/PageHeader'
import ProgressBar from '@/components/campaign/ProgressBar'
import { api } from '@/lib/api'
import { formatBDT } from '@/lib/utils'

const statusColors: Record<string, string> = {
  ACTIVE:    'bg-emerald-100 text-emerald-700',
  DRAFT:     'bg-gray-100 text-gray-600',
  PAUSED:    'bg-amber-100 text-amber-700',
  COMPLETED: 'bg-blue-100 text-blue-700',
  SUSPENDED: 'bg-red-100 text-red-700',
}

const donationStatusColors: Record<string, string> = {
  COMPLETED: 'bg-emerald-100 text-emerald-700',
  PENDING:   'bg-amber-100 text-amber-700',
  REFUNDED:  'bg-red-100 text-red-700',
}

export default function CreatorDashboardPage() {
  const [statsData,       setStatsData]       = useState<any>(null)
  const [myCampaigns,     setMyCampaigns]     = useState<any[]>([])
  const [recentDonations, setRecentDonations] = useState<any[]>([])
  const [isLoading,       setIsLoading]       = useState(true)

  useEffect(() => {
    Promise.all([
      api.get<any>('/analytics/creator'),
      api.get<any>('/campaigns/my?limit=5'),
      api.get<any>('/donations/creator?limit=5'),
    ]).then(([statsRes, campaignsRes, donationsRes]) => {
      if (statsRes.success)     setStatsData(statsRes.data)
      if (campaignsRes.success) setMyCampaigns(campaignsRes.data)
      if (donationsRes.success) setRecentDonations(donationsRes.data)
    }).catch(() => {}).finally(() => setIsLoading(false))
  }, [])

  const statCards = [
    {
      label: 'Total Raised',
      value: statsData ? formatBDT(statsData.totalRaised) : '—',
      icon: TrendingUp,
      color: 'text-emerald-600',
      bg: 'bg-emerald-50',
    },
    {
      label: 'Active Campaigns',
      value: statsData?.activeCampaigns ?? '—',
      icon: Target,
      color: 'text-blue-600',
      bg: 'bg-blue-50',
    },
    {
      label: 'Total Donors',
      value: statsData?.totalDonors ?? '—',
      icon: Users,
      color: 'text-violet-600',
      bg: 'bg-violet-50',
    },
    {
      label: 'Draft Campaigns',
      value: statsData?.draftCampaigns ?? '—',
      icon: FileText,
      color: 'text-amber-600',
      bg: 'bg-amber-50',
    },
  ]

  return (
    <DashboardLayout role="creator">
      <PageHeader
        title="Dashboard"
        action={
          <Link
            href="/creator/campaigns/create"
            className="inline-flex items-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white text-sm font-medium px-4 py-2 rounded-lg transition-colors"
          >
            <Plus className="w-4 h-4" />
            Create Campaign
          </Link>
        }
      />

      {/* Stats Row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4 mb-8">
        {statCards.map((stat) => (
          <div key={stat.label} className="bg-white rounded-xl border border-gray-200 shadow-sm p-5 flex items-center gap-4">
            <div className={`w-11 h-11 rounded-xl ${stat.bg} flex items-center justify-center shrink-0`}>
              <stat.icon className={`w-5 h-5 ${stat.color}`} />
            </div>
            <div>
              <p className="text-sm text-slate-500">{stat.label}</p>
              <p className="text-xl font-bold text-slate-900 mt-0.5">
                {isLoading ? '…' : stat.value}
              </p>
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6 mb-8">
        {/* Recent Donations */}
        <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between">
            <h2 className="text-base font-semibold text-slate-900">Recent Donations</h2>
            <Link href="/creator/donations" className="text-xs text-emerald-600 hover:text-emerald-700 font-medium">
              View all
            </Link>
          </div>
          {recentDonations.length === 0 ? (
            <div className="px-6 py-10 text-center text-slate-400 text-sm">No donations yet.</div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="bg-gray-50 text-left">
                    <th className="px-6 py-3 text-xs font-medium text-slate-500 uppercase tracking-wide">Donor</th>
                    <th className="px-6 py-3 text-xs font-medium text-slate-500 uppercase tracking-wide">Amount</th>
                    <th className="px-6 py-3 text-xs font-medium text-slate-500 uppercase tracking-wide hidden md:table-cell">Campaign</th>
                    <th className="px-6 py-3 text-xs font-medium text-slate-500 uppercase tracking-wide hidden lg:table-cell">Date</th>
                    <th className="px-6 py-3 text-xs font-medium text-slate-500 uppercase tracking-wide">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {recentDonations.map((d) => (
                    <tr key={d.id} className="hover:bg-gray-50 transition-colors">
                      <td className="px-6 py-3 font-medium text-slate-800">
                        {d.isAnonymous ? 'Anonymous' : d.donor?.name ?? '—'}
                      </td>
                      <td className="px-6 py-3 font-semibold text-emerald-600">{formatBDT(d.amount)}</td>
                      <td className="px-6 py-3 text-slate-500 hidden md:table-cell max-w-[160px] truncate">
                        {d.campaign?.title ?? '—'}
                      </td>
                      <td className="px-6 py-3 text-slate-400 hidden lg:table-cell">
                        {new Date(d.createdAt).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' })}
                      </td>
                      <td className="px-6 py-3">
                        <span className={`inline-block px-2 py-0.5 rounded-full text-xs font-medium capitalize ${donationStatusColors[d.status] ?? 'bg-gray-100 text-gray-600'}`}>
                          {d.status.toLowerCase()}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* My Campaigns Mini List */}
        <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between">
            <h2 className="text-base font-semibold text-slate-900">My Campaigns</h2>
            <Link href="/creator/campaigns" className="text-xs text-emerald-600 hover:text-emerald-700 font-medium">
              View all
            </Link>
          </div>
          {myCampaigns.length === 0 ? (
            <div className="px-6 py-10 text-center text-slate-400 text-sm">No campaigns found.</div>
          ) : (
            <ul className="divide-y divide-gray-100">
              {myCampaigns.map((c) => {
                const pct = Math.min(100, Math.round((c.raisedAmount / c.goalAmount) * 100))
                return (
                  <li key={c.id} className="px-6 py-4 hover:bg-gray-50 transition-colors">
                    <div className="flex items-start justify-between gap-3 mb-2">
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-slate-800 truncate">{c.title}</p>
                        <p className="text-xs text-slate-400 mt-0.5">
                          {formatBDT(c.raisedAmount)} raised of {formatBDT(c.goalAmount)} · {pct}%
                        </p>
                      </div>
                      <div className="flex items-center gap-2 shrink-0">
                        <span className={`inline-block px-2 py-0.5 rounded-full text-xs font-medium capitalize ${statusColors[c.status] ?? 'bg-gray-100 text-gray-600'}`}>
                          {c.status.toLowerCase()}
                        </span>
                        <Link
                          href={`/creator/campaigns/${c.id}/edit`}
                          className="p-1.5 rounded-lg text-slate-400 hover:text-emerald-600 hover:bg-emerald-50 transition-colors"
                          title="Edit campaign"
                        >
                          <Pencil className="w-3.5 h-3.5" />
                        </Link>
                      </div>
                    </div>
                    <ProgressBar value={pct} />
                  </li>
                )
              })}
            </ul>
          )}
        </div>
      </div>

      {/* Quick Actions */}
      <div className="bg-white rounded-xl border border-gray-200 shadow-sm px-6 py-5">
        <h2 className="text-base font-semibold text-slate-900 mb-4">Quick Actions</h2>
        <div className="flex flex-wrap gap-3">
          <Link
            href="/creator/analytics"
            className="inline-flex items-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white text-sm font-medium px-4 py-2 rounded-lg transition-colors"
          >
            <BarChart2 className="w-4 h-4" />
            View Analytics
          </Link>
          <Link
            href="/creator/campaigns/create"
            className="inline-flex items-center gap-2 border border-gray-200 hover:border-emerald-300 hover:text-emerald-700 text-slate-600 text-sm font-medium px-4 py-2 rounded-lg transition-colors"
          >
            <Plus className="w-4 h-4" />
            New Campaign
          </Link>
          <Link
            href="/creator/donations"
            className="inline-flex items-center gap-2 border border-gray-200 hover:border-emerald-300 hover:text-emerald-700 text-slate-600 text-sm font-medium px-4 py-2 rounded-lg transition-colors"
          >
            <TrendingUp className="w-4 h-4" />
            All Donations
          </Link>
        </div>
      </div>
    </DashboardLayout>
  )
}