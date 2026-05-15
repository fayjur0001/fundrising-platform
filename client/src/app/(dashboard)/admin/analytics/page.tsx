// src/app/(dashboard)/admin/analytics/page.tsx
'use client'

import { useState } from 'react'
import DashboardLayout from '@/components/layout/DashboardLayout'
import PageHeader from '@/components/common/PageHeader'
import MonthlyGrowthChart from '@/components/charts/MonthlyGrowthChart'
import DonationTrendChart from '@/components/charts/DonationTrendChart'
import TopCampaignsChart from '@/components/charts/TopCampaignsChart'
import TopCategoriesChart from '@/components/charts/TopCategoriesChart'
import { formatBDT } from '@/lib/utils'
import { TrendingUp, BarChart2, Users, Layers } from 'lucide-react'

type DateRange = '7d' | '30d' | '90d' | '1y'

const DATE_RANGE_OPTIONS: { key: DateRange; label: string }[] = [
  { key: '7d', label: 'Last 7 days' },
  { key: '30d', label: 'Last 30 days' },
  { key: '90d', label: 'Last 90 days' },
  { key: '1y', label: '1 year' },
]

const STATS_BY_RANGE: Record
  DateRange,
  { totalRaised: number; monthlyGrowth: number; activeCampaigns: number; newUsers: number }
> = {
  '7d':  { totalRaised: 1_850_000,  monthlyGrowth: 4.2,  activeCampaigns: 38,  newUsers: 94   },
  '30d': { totalRaised: 7_340_500,  monthlyGrowth: 12.7, activeCampaigns: 61,  newUsers: 387  },
  '90d': { totalRaised: 21_920_000, monthlyGrowth: 28.4, activeCampaigns: 89,  newUsers: 1124 },
  '1y':  { totalRaised: 84_670_000, monthlyGrowth: 63.1, activeCampaigns: 142, newUsers: 4890 },
}

interface StatCardProps {
  label: string
  value: string
  sub: string
  icon: React.ReactNode
  iconBg: string
  trend?: 'up' | 'neutral'
}

function StatCard({ label, value, sub, icon, iconBg, trend = 'up' }: StatCardProps) {
  return (
    <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-5 flex items-start gap-4">
      <div className={`${iconBg} p-3 rounded-xl shrink-0`}>{icon}</div>
      <div className="min-w-0">
        <p className="text-xs font-medium text-slate-500 uppercase tracking-wide mb-0.5">{label}</p>
        <p className="text-2xl font-bold text-slate-900 truncate">{value}</p>
        <p className={`text-xs mt-0.5 font-medium ${trend === 'up' ? 'text-emerald-600' : 'text-slate-400'}`}>
          {sub}
        </p>
      </div>
    </div>
  )
}

export default function AdminAnalyticsPage() {
  const [range, setRange] = useState<DateRange>('30d')
  const stats = STATS_BY_RANGE[range]

  return (
    <DashboardLayout role="admin">
      {/* Header row */}
      <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
        <PageHeader
          title="Platform Analytics"
          description="Monitor platform-wide performance, growth, and donation trends."
        />

        {/* Date range selector */}
        <div className="flex items-center gap-1 bg-gray-100 rounded-lg p-1 self-start shrink-0">
          {DATE_RANGE_OPTIONS.map((opt) => (
            <button
              key={opt.key}
              onClick={() => setRange(opt.key)}
              className={`px-3 py-1.5 text-xs font-medium rounded-md transition-colors whitespace-nowrap ${
                range === opt.key
                  ? 'bg-white text-emerald-700 shadow-sm font-semibold'
                  : 'text-slate-500 hover:text-slate-700'
              }`}
            >
              {opt.label}
            </button>
          ))}
        </div>
      </div>

      {/* Stats cards */}
      <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
        <StatCard
          label="Total Raised"
          value={formatBDT(stats.totalRaised)}
          sub="Across all campaigns"
          icon={<TrendingUp className="w-5 h-5 text-emerald-600" />}
          iconBg="bg-emerald-50"
          trend="up"
        />
        <StatCard
          label="Monthly Growth"
          value={`${stats.monthlyGrowth}%`}
          sub="vs previous period"
          icon={<BarChart2 className="w-5 h-5 text-blue-600" />}
          iconBg="bg-blue-50"
          trend="up"
        />
        <StatCard
          label="Active Campaigns"
          value={stats.activeCampaigns.toString()}
          sub="Currently running"
          icon={<Layers className="w-5 h-5 text-amber-600" />}
          iconBg="bg-amber-50"
          trend="neutral"
        />
        <StatCard
          label="New Users"
          value={stats.newUsers.toLocaleString()}
          sub="Registered this period"
          icon={<Users className="w-5 h-5 text-purple-600" />}
          iconBg="bg-purple-50"
          trend="up"
        />
      </div>

      {/* 2×2 Chart grid */}
      <div className="mt-6 grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Top-left */}
        <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-5">
          <h3 className="text-sm font-semibold text-slate-700 mb-4">Monthly Growth</h3>
          <MonthlyGrowthChart />
        </div>

        {/* Top-right */}
        <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-5">
          <h3 className="text-sm font-semibold text-slate-700 mb-4">Donation Trend</h3>
          <DonationTrendChart />
        </div>

        {/* Bottom-left */}
        <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-5">
          <h3 className="text-sm font-semibold text-slate-700 mb-4">Top Campaigns</h3>
          <TopCampaignsChart />
        </div>

        {/* Bottom-right */}
        <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-5">
          <h3 className="text-sm font-semibold text-slate-700 mb-4">Top Categories</h3>
          <TopCategoriesChart />
        </div>
      </div>
    </DashboardLayout>
  )
}