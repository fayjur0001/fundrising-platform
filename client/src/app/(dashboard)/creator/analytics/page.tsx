// src/app/(dashboard)/creator/analytics/page.tsx
'use client'

import { useState } from 'react'
import DashboardLayout from '@/components/layout/DashboardLayout'
import PageHeader from '@/components/common/PageHeader'
import DonationTrendChart from '@/components/charts/DonationTrendChart'
import TopCampaignsChart from '@/components/charts/TopCampaignsChart'
import { mockCampaigns, mockDonations } from '@/lib/mockData'
import { formatBDT } from '@/lib/utils'
import { TrendingUp, Calendar, Trophy, BarChart2 } from 'lucide-react'

const CREATOR_ID = 'user-002'

type DateRange = '7' | '30' | '90'

const DATE_RANGE_TABS: { label: string; value: DateRange }[] = [
  { label: 'Last 7 days', value: '7' },
  { label: 'Last 30 days', value: '30' },
  { label: 'Last 90 days', value: '90' },
]

function timeAgo(dateStr: string): string {
  const diff = Date.now() - new Date(dateStr).getTime()
  const mins = Math.floor(diff / 60000)
  const hours = Math.floor(mins / 60)
  const days = Math.floor(hours / 24)
  if (days > 0) return `${days} day${days !== 1 ? 's' : ''} ago`
  if (hours > 0) return `${hours} hour${hours !== 1 ? 's' : ''} ago`
  if (mins > 0) return `${mins} minute${mins !== 1 ? 's' : ''} ago`
  return 'Just now'
}

export default function CreatorAnalyticsPage() {
  const [dateRange, setDateRange] = useState<DateRange>('30')

  const myCampaigns = mockCampaigns.filter((c) => c.creatorId === CREATOR_ID)
  const myCampaignIds = new Set(myCampaigns.map((c) => c.id))

  const cutoff = new Date(Date.now() - parseInt(dateRange) * 24 * 60 * 60 * 1000)
  const allMyDonations = mockDonations.filter((d) => myCampaignIds.has(d.campaignId))
  const filteredDonations = allMyDonations.filter((d) => new Date(d.createdAt) >= cutoff)
  const completedDonations = filteredDonations.filter((d) => d.status === 'completed')

  const totalRaised = completedDonations.reduce((sum, d) => sum + d.amount, 0)
  const avgDonation = completedDonations.length > 0 ? totalRaised / completedDonations.length : 0

  const now = new Date()
  const monthStart = new Date(now.getFullYear(), now.getMonth(), 1)
  const thisMonthTotal = allMyDonations
    .filter((d) => d.status === 'completed' && new Date(d.createdAt) >= monthStart)
    .reduce((sum, d) => sum + d.amount, 0)

  const topCampaign = myCampaigns.reduce(
    (top, c) => (!top || c.raisedAmount > top.raisedAmount ? c : top),
    null as (typeof myCampaigns)[0] | null
  )

  const recentActivity = allMyDonations
    .slice()
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
    .slice(0, 5)

  const stats = [
    {
      label: 'Total Raised',
      value: formatBDT(totalRaised),
      icon: TrendingUp,
      color: 'text-emerald-600',
      bg: 'bg-emerald-50',
      sub: `${completedDonations.length} donations`,
    },
    {
      label: 'This Month',
      value: formatBDT(thisMonthTotal),
      icon: Calendar,
      color: 'text-blue-600',
      bg: 'bg-blue-50',
      sub: new Date().toLocaleString('default', { month: 'long', year: 'numeric' }),
    },
    {
      label: 'Top Campaign',
      value: topCampaign ? topCampaign.title : '—',
      icon: Trophy,
      color: 'text-amber-600',
      bg: 'bg-amber-50',
      sub: topCampaign ? formatBDT(topCampaign.raisedAmount) : 'No campaigns',
      truncate: true,
    },
    {
      label: 'Avg. Donation',
      value: formatBDT(avgDonation),
      icon: BarChart2,
      color: 'text-violet-600',
      bg: 'bg-violet-50',
      sub: `Over ${parseInt(dateRange)} days`,
    },
  ]

  return (
    <DashboardLayout role="creator">
      <PageHeader title="Analytics" />

      {/* Date Range Tabs */}
      <div className="flex gap-1 bg-gray-100 p-1 rounded-xl w-fit mb-6">
        {DATE_RANGE_TABS.map((tab) => (
          <button
            key={tab.value}
            onClick={() => setDateRange(tab.value)}
            className={`px-4 py-1.5 rounded-lg text-sm font-medium transition-colors whitespace-nowrap ${
              dateRange === tab.value
                ? 'bg-white text-slate-900 shadow-sm'
                : 'text-slate-500 hover:text-slate-700'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4 mb-8">
        {stats.map((stat) => (
          <div key={stat.label} className="bg-white rounded-xl border border-gray-200 shadow-sm p-5">
            <div className="flex items-center gap-3 mb-3">
              <div className={`w-10 h-10 rounded-xl ${stat.bg} flex items-center justify-center shrink-0`}>
                <stat.icon className={`w-5 h-5 ${stat.color}`} />
              </div>
              <p className="text-sm text-slate-500">{stat.label}</p>
            </div>
            <p className={`text-xl font-bold text-slate-900 ${stat.truncate ? 'truncate' : ''}`} title={stat.truncate ? stat.value : undefined}>
              {stat.value}
            </p>
            <p className="text-xs text-slate-400 mt-1 truncate">{stat.sub}</p>
          </div>
        ))}
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6 mb-8">
        <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6">
          <h2 className="text-base font-semibold text-slate-900 mb-4">Donation Trend</h2>
          <DonationTrendChart donations={filteredDonations} days={parseInt(dateRange)} />
        </div>
        <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6">
          <h2 className="text-base font-semibold text-slate-900 mb-4">Top Campaigns</h2>
          <TopCampaignsChart campaigns={myCampaigns} />
        </div>
      </div>

      {/* Recent Activity */}
      <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-100">
          <h2 className="text-base font-semibold text-slate-900">Recent Activity</h2>
        </div>
        {recentActivity.length === 0 ? (
          <div className="px-6 py-10 text-center text-slate-400 text-sm">No recent activity.</div>
        ) : (
          <ul className="divide-y divide-gray-100">
            {recentActivity.map((d) => (
              <li key={d.id} className="px-6 py-4 flex items-center gap-4 hover:bg-gray-50 transition-colors">
                <div className="w-9 h-9 rounded-full bg-emerald-100 flex items-center justify-center shrink-0">
                  <span className="text-sm font-semibold text-emerald-700">
                    {d.isAnonymous ? '?' : d.donorName.charAt(0).toUpperCase()}
                  </span>
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-slate-800">
                    {d.isAnonymous ? 'Anonymous' : d.donorName}
                    <span className="font-normal text-slate-500"> donated </span>
                    <span className="text-emerald-600 font-semibold">{formatBDT(d.amount)}</span>
                  </p>
                  <p className="text-xs text-slate-400 truncate mt-0.5">{d.campaignTitle}</p>
                </div>
                <div className="text-xs text-slate-400 whitespace-nowrap shrink-0">
                  {timeAgo(d.createdAt)}
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>
    </DashboardLayout>
  )
}